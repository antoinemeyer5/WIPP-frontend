import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import {PluginService} from '../../plugin/plugin.service';
import {WorkflowService} from '../workflow.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Workflow} from '../workflow';
import {forkJoin, of as observableOf, Subject} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {JobDetailComponent} from '../../job/job-detail/job-detail.component';
import {Job} from '../../job/job';
import {FormProperty, PropertyGroup} from 'ngx-schema-form/lib/model/formproperty';
import {NgxSpinnerService} from 'ngx-spinner';
import {AppConfigService} from '../../app-config.service';
import urlJoin from 'url-join';
import {JobService} from '../../job/job.service';
import {dataMap} from '../../data-service';
import {WorkflowNewComponent} from '../workflow-new/workflow-new.component';
import {KeycloakService} from '../../services/keycloak/keycloak.service';
import {DialogService} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-workflow-detail',
  templateUrl: './workflow-detail.component.html',
  styleUrls: ['./workflow-detail.component.css'],
  providers: [DialogService, MessageService]
})

export class WorkflowDetailComponent implements OnInit, OnDestroy {

  workflow: Workflow = new Workflow();

  selectedSchema = null;
  pluginList = [];
  jobOutputs = {
    collection: [],
    stitchingVector: [],
    pyramidAnnotation: [],
    pyramid: [],
    aiModel: [],
    tensorboardLogs: [],
    csvCollection: [],
    notebook: [],
    genericData: []
  };
  jobs: Job[] = [];
  workflowId = this.route.snapshot.paramMap.get('id');
  jobModel = {};
  editMode = false;

  // ngx-graph settings and properties
  update$: Subject<any> = new Subject();
  nodes = [];
  links = [];
  enableZoom = false;
  layoutSettings = {
    orientation: 'LR'
  };
  orientationOptions = [
    {
      value: 'LR',
      label: 'Left to right'
    },
    {
      value: 'RL',
      label: 'Right to left'
    },
    {
      value: 'TB',
      label: 'Top to bottom'
    },
    {
      value: 'BT',
      label: 'Bottom to top'
    }
  ];

  argoUiBaseUrl = '';
  argoUiLink;

  newTaskDialogVisible = false;

  public data: Array<any>;
  public service: any;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private dialogService: DialogService,
    private spinner: NgxSpinnerService,
    private pluginService: PluginService,
    private workflowService: WorkflowService,
    private appConfigService: AppConfigService,
    private jobService: JobService,
    private keycloakService: KeycloakService,
    private injector: Injector,
    private router: Router) {
  }

  ngOnInit() {
    this.argoUiBaseUrl = this.appConfigService.getConfig().argoUiBaseUrl;
    this.workflowService.getWorkflow(this.workflowId).subscribe(workflow => {
      this.workflow = workflow;
      this.pluginService.getAllPluginsOrderedByName()
        .subscribe(plugins => {
          this.pluginList = plugins.plugins;
          this.generateSchema(this.pluginList);
          this.resetForm();
          this.getJobs();
        });
      this.updateArgoUrl();
    }, error => {
      this.router.navigate(['/404']);
    });
  }

  resetForm() {
    this.selectedSchema = this.pluginList[0];
    this.jobModel = {};
    this.editMode = false;
  }

  open() {
    this.newTaskDialogVisible = true;
  }

  saveTask(result) {
    const task = {};

    // configure job
    if (this.editMode) {
      task['id'] = this.jobModel['id'];
    }
    task['name'] = this.workflow.name + '-' + result.taskName;
    task['wippExecutable'] = this.selectedSchema.id;
    task['wippWorkflow'] = this.workflow.id;
    task['type'] = this.selectedSchema.name;
    task['dependencies'] = [];
    task['parameters'] = {};
    task['outputParameters'] = {};
    // add job parameters

    this.selectedSchema.outputs.forEach(output => {
      task['outputParameters'][output.name] = null;
    });

    for (const inputEntry in result.inputs) {
      if (result.inputs.hasOwnProperty(inputEntry)) {
        const type = this.selectedSchema.properties.inputs.properties[inputEntry]['format'];
        let value = result.inputs[inputEntry];
        if (type === 'collection' ||
          type === 'stitchingVector' ||
          type === 'pyramid' ||
          type === 'pyramidAnnotation' ||
          type === 'aiModel' ||
          type === 'tensorflowModel' || // legacy
          type === 'csvCollection' ||
          type === 'notebook' ||
          type == 'genericData') {
          if (value.hasOwnProperty('virtual') && value.virtual === true && value.hasOwnProperty('sourceJob')) {
            if (task['dependencies'].indexOf(value.sourceJob) === -1) {
              task['dependencies'].push(value.sourceJob);
            }
          }
          value = value.hasOwnProperty('id') ? value.id : null;
        }
        if (type === 'array') {
          value = value.join(',');
        }
        task['parameters'][inputEntry] = value;
      }
    }

    const workflowServiceCall = this.editMode ? this.workflowService.updateJob(task)
      : this.workflowService.createJob(task);
    workflowServiceCall.subscribe(job => {
      this.resetForm();
      this.getJobs();
    }, error => {
      this.resetForm();
      this.messageService.add({ severity: 'error', summary: 'Error while creating new task', detail: error.error });
    });
  }

  populateJobOutputs(job) {
    const pluginId = job.wippExecutable;
    const matchingPlugin = this.pluginList.find(x => x.id === pluginId);

    matchingPlugin.outputs.forEach(output => {
      const outputData = {
        id: '{{ ' + job.id + '.' + output.name + ' }}',
        name: '{{ ' + job.name + '.' + output.name + ' }}',
        sourceJob: job['id'],
        virtual: true
      };
      this.jobOutputs[output.type].push(outputData);
    });
  }

  submitWorkflow() {
    this.spinner.show();
    this.workflowService.submitWorkflow(this.workflow)
      .subscribe(
        result => {
        },
        error => {
          this.spinner.hide();
          this.messageService.add({ severity: 'error', summary: 'Workflow submission failed', detail: error.error });
        }
      ).add(() => {
      this.workflowService.getWorkflow(this.workflowId).subscribe(workflow => {
        this.workflow = workflow;
        this.updateArgoUrl();
        this.spinner.hide(); // if submission was successful, spinner is still spinning
      });
    });
  }

  copyWorkflow() {
    let modalRef = this.dialogService.open(WorkflowNewComponent, {
      header: 'New workflow',
      position: 'top',
      width: '50vw',
      data: {
        isCopy: true,
        sourceWorkflow: this.workflow
      },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });
  }

   refreshPage() {
    window.location.reload();
   }

  generateSchema(pluginList) {
    pluginList.forEach(plugin => {
      // group title and description together for better display
      plugin.title = plugin.title + " - " + plugin.description;
      plugin.description = "";
      // set up for properties
      plugin.properties = {
        // task name field
        'taskName': {
          'type': 'string',
          'description': 'Task name',
          'format': 'string',
          'widget': 'string',
          'placeholder': 'Enter a name for this task',
          'maxLength': 127 - this.workflow.name.length
        },
        // job inputs fields
        'inputs': {
          'type': 'object',
          'required': [],
          'properties': {}
        }
      };

      try {
        // default field bindings - none
        plugin.fieldBindings = {};
        // TODO: validation of plugin ui description
        plugin.inputs.forEach(input => {
          const inputSchema = {};
          // common properties
          inputSchema['key'] = 'inputs.' + input.name;
          // inputSchema['description'] = input.description;
          if (input.required) {
            plugin.properties.inputs.required.push(input.name);
          }
          // type-specific properties

          switch (input.type) {
            case 'collection':
            case 'stitchingVector':
            case 'pyramidAnnotation':
            case 'pyramid':
            case 'csvCollection':
            case 'notebook':
            case 'genericData':
              inputSchema['type'] = 'string';
              inputSchema['widget'] = 'search';
              inputSchema['format'] = input.type;
              inputSchema['getOutputs'] = () => this.jobOutputs[input.type];
              break;
            case 'aiModel':
            case 'tensorflowModel': // legacy
              inputSchema['type'] = 'string';
              inputSchema['widget'] = 'search';
              inputSchema['format'] = 'aiModel';
              inputSchema['getOutputs'] = () => this.jobOutputs['aiModel'];
              break;
            case 'enum':
              inputSchema['type'] = 'string';
              inputSchema['widget'] = 'select';
              inputSchema['oneOf'] = [];
              input.options.values.forEach(value => {
                inputSchema['oneOf'].push({
                  'enum': [value],
                  'description': value
                });
              });
              inputSchema['default'] = input.options.values[0];
              break;
            case 'array':
              inputSchema['type'] = 'array';
              inputSchema['format'] = 'array';
              inputSchema['items'] = input.options.items;
              break;
            // Workaround for https://github.com/guillotinaweb/ngx-schema-form/issues/332
            case 'number':
            case 'float':
              inputSchema['type'] = 'string';
              inputSchema['widget'] = 'integer';
              break;
            default:
              inputSchema['type'] = input.type;
          }
          // ui properties
          const ui = plugin.ui.find(v => v.key === inputSchema['key']);
          if (ui.hasOwnProperty('title')) {
            inputSchema['title'] = ui.title;
          }
          if (ui.hasOwnProperty('description')) {
            inputSchema['placeholder'] = ui.description;
          }
          if (ui.hasOwnProperty('condition')) {
            inputSchema['condition'] = ui.condition;
            const conditionElements = ui.condition.split('==');
            if (conditionElements.length === 2) {
              const inputName = conditionElements[0].split('.');
              if (inputName.length > 0) {
                inputSchema['visibleIf'] = {};
                console.log(conditionElements[1]);
                inputSchema['visibleIf'][inputName[inputName.length - 1]] = conditionElements[1].replace(/'/g, "");
              }
            }
          }
          // hidden fields
          if (ui.hasOwnProperty('hidden') && ui.hidden === true) {
            inputSchema['widget'] = 'hidden';
          }
          // custom bindings - update value of target input from value of source input
          if (ui.hasOwnProperty('bind')) {
            const sourceField = '/inputs/' + ui.bind;
            const targetField = ui['key'].split('.').join('/');
            plugin.fieldBindings[sourceField] = [
              {
                'input': (event, formProperty: FormProperty) => {
                  const parent: PropertyGroup = formProperty.findRoot();
                  const target: FormProperty = parent.getProperty(targetField);

                  target.setValue(formProperty.value, false);
                }
              }
            ];
          }
          if (ui.hasOwnProperty('default')) {
            inputSchema['default'] = ui.default;
          }
          plugin.properties.inputs.properties[input.name] = inputSchema;
        });
        // field sets - arrange fields by groups
        const fieldsetsList = plugin.ui.find(v => v.key === 'fieldsets');
        if (fieldsetsList) {
          plugin.properties.inputs.fieldsets = fieldsetsList.fieldsets;
        }
        plugin.isSchemaValid = true;
      } catch (error) {
        plugin.properties = {};
        plugin.isSchemaValid = false;
      }
    });
  }

  getJobs(): void {
    this.workflowService.getAllJobs(this.workflow).pipe(
      map(data => {
        return data.jobs;
      }),
      catchError(() => {
        return observableOf([]);
      })
    ).subscribe(data => {
      this.jobs = data;
      this.populateGraph(data);
      this.updateGraph();
      this.resetJobOutputs();
      for (const job of data) {
        this.populateJobOutputs(job);
      }
    });
  }

  displayJobModal(jobId: string) {
    this.dialogService.open(JobDetailComponent, {
      header: 'Job detail',
      position: 'top',
      width: '50vw',
      data: {
        jobId: jobId
      },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });
  }

  openCopy(jobId: string) {
    this.populateAndOpenCopyModal(jobId);
  }

  openEdit(jobId: string) {
    this.editMode = true;
    this.populateAndOpenCopyModal(jobId);
  }

  getDependencies(jobId: String) {
    const jobDependencies = this.jobs.filter(job =>
      job.dependencies.includes(jobId)).length > 0 ? this.jobs.filter(job => job.dependencies.includes(jobId)) : null;
    return (jobDependencies);
  }

  deleteJob(jobId: string) {
    const job: Job  = this.jobs.find(jobA => jobA.id === jobId);
    const jobDependencies = this.getDependencies(jobId);
    let text = 'Are you sure you want to delete the job ' + job.name + '? \n' ;
    if (jobDependencies) {
      text += 'This job has dependencies which will be deleted too \n ';
    }
    const requests = [];
    requests.push(this.jobService.deleteJob(job));
    this.deleteDependencies(job, requests);
    if (confirm(text)) {
      forkJoin(requests).subscribe(data => this.getJobs());
    }
  }

  deleteDependencies(job: Job, requests) {
    const dependencies = this.getDependencies(job.id);
    if (dependencies) {
      for (const dependency of dependencies) {
        requests.push(this.jobService.deleteJob(dependency));
        this.deleteDependencies(dependency, requests);
      }
    }
  }

  populateAndOpenCopyModal(jobId: string) {
    this.jobService.getJob(jobId).subscribe(jobToCopy => {
        this.jobService.getPlugin(jobToCopy.wippExecutable).subscribe(plugin => {
          this.selectedSchema = this.pluginList.find(x => x.id === plugin.id);
          if (this.editMode) {
            this.jobModel['id'] = jobId;
          }
          this.jobModel['taskName'] = jobToCopy.name.replace(this.workflow.name + '-', '');
          if (!this.editMode) {
            this.jobModel['taskName'] += '-copy';
          }
          this.jobModel['inputs'] = {};
          const requests = [];
          for (const input of Object.keys(jobToCopy.parameters)) {
            // if input to copy is an existing WIPP object
            if (this.selectedSchema.properties.inputs.properties[input]['widget']
              && (this.selectedSchema.properties.inputs.properties[input]['widget'] === 'search'
                || this.selectedSchema.properties.inputs.properties[input]['widget']['id'] === 'search')) {
              if (jobToCopy.parameters[input].indexOf('{') === -1) {
                const id = jobToCopy.parameters[input];
                // Resolve AbstractFactory
                const injectable = dataMap.get(this.selectedSchema.properties.inputs.properties[input]['format']);
                // Inject service
                this.service = this.injector.get(injectable);
                requests.push(this.service.getById(id).pipe(map(response => {
                    response['data'] = response;
                    response['inputName'] = input;
                    return response;
                  })
                ));
              } else {
                // if input to copy is a WIPP object not created yet (output of a previous step not executed)
                this.jobModel['inputs'][input] = {};
                this.jobModel['inputs'][input]['id'] = jobToCopy.parameters[input];
                const prevId = jobToCopy.parameters[input].substring(3, jobToCopy.parameters[input].indexOf('.'));
                const prevOutputName = jobToCopy.parameters[input].substring(
                  jobToCopy.parameters[input].indexOf('.'),
                  jobToCopy.parameters[input].length - 3
                );
                const prevJob = this.jobs.find(x => x.id === prevId);
                this.jobModel['inputs'][input]['name'] = '{{ ' + prevJob.name + prevOutputName + ' }}';
                this.jobModel['inputs'][input]['virtual'] = true;
                this.jobModel['inputs'][input]['sourceJob'] = prevId;
              }
            } else if (this.selectedSchema.properties.inputs.properties[input]['type'] === 'array') {
              // if input to copy is an array of strings joined into a single string
              this.jobModel['inputs'][input] = jobToCopy.parameters[input] ? jobToCopy.parameters[input].split(',') : null ;
            } else {
              // if input to copy is a standard type (string, int...)
              this.jobModel['inputs'][input] = jobToCopy.parameters[input] ? jobToCopy.parameters[input] : null ;
            }
          }
          if (requests.length === 0) {
            this.open();
          } else {forkJoin(requests).subscribe(results => {
            for (const result of results) {
              this.jobModel['inputs'][result['inputName']] = result['data'];
            }
            this.open();
          });
          }
        });
      }
    );
  }

  // Create workflow DAG
  populateGraph(data: Job[]) {
    this.nodes = [];
    this.links = [];
    for (const job of data) {
      const node = {id: job.id, label: job.name};
      this.nodes.push(node);
      if (job.dependencies.length > 0) {
        for (let i = 0; i < job.dependencies.length; i ++) {
          const link = {id: 'link', source: job.dependencies[i], target: job.id};
          this.links.push(link);
        }
      }
    }
  }

  // Update workflow DAG
  updateGraph() {
    this.update$.next(true);
  }

  resetJobOutputs() {
    this.jobOutputs = {
      collection: [],
      stitchingVector: [],
      pyramidAnnotation: [],
      pyramid: [],
      aiModel: [],
      tensorboardLogs: [],
      csvCollection: [],
      notebook: [],
      genericData: []
    };
  }

  updateArgoUrl() {
    if (this.workflow.generatedName) {
      this.argoUiLink = urlJoin(this.argoUiBaseUrl, this.workflow.generatedName);
    }
  }

  makeWorkflowPublic(): void {
    this.workflowService.makeWorkflowPublic(
      this.workflow).subscribe(workflow => {
        this.refreshPage();
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Unable to set workflow to public', detail: error.error });
      });
  }

  canEdit(): boolean {
    return this.keycloakService.canEdit(this.workflow);
  }

  canCreate(): boolean {
    return(this.keycloakService.isLoggedIn());
  }

  ngOnDestroy() {
    this.dialogService.dialogComponentRefMap.forEach((dialog) => dialog.destroy());
  }
}
