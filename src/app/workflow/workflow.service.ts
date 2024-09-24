import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { PaginatedWorkflows, Workflow } from './workflow';
import { Job, PaginatedJobs } from '../job/job';
import { StitchingVector } from '../stitching-vector/stitching-vector';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  params: {}
};

@Injectable({providedIn: 'root'})
export class WorkflowService {
  constructor(
    private http: HttpClient
  ) {
  }

  private workflowsUrl = environment.apiRootUrl + '/workflows';
  private jobsUrl = environment.apiRootUrl + '/jobs';

  getWorkflows(params): Observable<PaginatedWorkflows> {
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      const httpParams = new HttpParams().set('page', page).set('size', size).set('sort', sort);
      httpOptions.params = httpParams;
    }
    return this.http.get<any>(this.workflowsUrl, httpOptions).pipe(
      map((result: any) => {
        result.workflows = result._embedded.workflows;
        return result;
      }));
  }


  getWorkflowsByNameContainingIgnoreCase(params, name): Observable<PaginatedWorkflows> {
    let httpParams = new HttpParams().set('name', name);
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      httpParams = httpParams.set('page', page).set('size', size).set('sort', sort);
    }
    httpOptions.params = httpParams;
    return this.http.get<any>(this.workflowsUrl + '/search/findByNameContainingIgnoreCase', httpOptions).pipe(
      map((result: any) => {
        result.workflows = result._embedded.workflows;
        return result;
      }));
  }

  getWorkflow(id: string): Observable<Workflow> {
    return this.http.get<Workflow>(`${this.workflowsUrl}/${id}`);
  }

  // getSchemaForm(pluginName: string): Observable<Object> {
  //   httpOptions.params = null;
  //   return this.http.post<Object>(
  //     this.workflowsUrl + '/search-ngx',
  //     {'name': pluginName},
  //     httpOptions
  //   );
  // }

  // getCollections(): string[] {
  //   return this.collection.concat(this.outputCollection);
  // }
  //
  // addCollection(collectionName): void {
  //   this.outputCollection.push(collectionName);
  // }
  //
  // resetCollection(): void {
  //   this.outputCollection = [];
  // }

  createWorkflow(workflow: Workflow): Observable<Workflow> {
    return this.http.post<Workflow>(this.workflowsUrl, workflow);
  }

  createJob(job): Observable<Job> {
    return this.http.post<Job>(this.jobsUrl, job);
  }

  updateJob(job): Observable<Job> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<Job>(`${this.jobsUrl}/${job['id']}`, job, httpOptions);
  }

  submitWorkflow(workflow): Observable<Workflow> {
    return this.http.post<Workflow>(
      `${this.workflowsUrl}/${workflow.id}/submit`,
      null,
      httpOptions
    );
  }

  copyWorkflow(workflow: Workflow, name: String): Observable<Workflow> {
    return this.http.post<Workflow>(`${this.workflowsUrl}/${workflow.id}/copy`, name);
  }

  getJobs(workflow: Workflow, params): Observable<PaginatedJobs> {
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const wippWorkflow = workflow.id ? workflow.id : null;
      const httpParams = new HttpParams().set('wippWorkflow', wippWorkflow).set('page', page).set('size', size);
      httpOptions.params = httpParams;
    }
    return this.http.get<any>(`${this.jobsUrl}/search/findByWippWorkflow`, httpOptions).pipe(
      map((result: any) => {
        result.jobs = result._embedded.jobs;
        return result;
      }));
  }
  getAllJobs(workflow: Workflow): Observable<PaginatedJobs> {
    if (workflow) {
      const wippWorkflow = workflow.id ? workflow.id : null;
      const httpParams = new HttpParams().set('wippWorkflow', wippWorkflow);
      httpOptions.params = httpParams;
    }
    return this.http.get<any>(`${this.jobsUrl}/search/findByWippWorkflowOrderByCreationDateAsc`, httpOptions).pipe(
      map((result: any) => {
        result.jobs = result._embedded.jobs;
        return result;
      }));
  }

  makeWorkflowPublic(workflow: Workflow): Observable<Workflow> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<Workflow>(`${this.workflowsUrl}/${workflow.id}`, {publiclyShared: true}, httpOptions);
  }

  getIconByWorkflowStatus(workflow: Workflow) : any {
    let status = workflow.status;
    let statusStyle = {
      piClass: "",
      colorStyle: "",
      severity: ""
    };
    switch(status) {
      case 'SUCCEEDED': {
        statusStyle.piClass = 'pi pi-check';
        statusStyle.colorStyle = "color: green";
        statusStyle.severity = "success";
        break;
      }
      case 'CREATED': {
        statusStyle.piClass = 'pi pi-pencil';
        statusStyle.colorStyle = "color: slateblue";
        statusStyle.severity = "secondary";
        break;
      }
      case 'SUBMITTED': {
        statusStyle.piClass = 'pi pi-spin pi-spinner';
        statusStyle.colorStyle = "color: blue";
        statusStyle.severity = "primary";
        break;
      }
      case 'RUNNING': {
        statusStyle.piClass = 'pi pi-spin pi-spinner';
        statusStyle.colorStyle = "color: blue";
        statusStyle.severity = "primary";
        break;
      }
      case 'ERROR': {
        statusStyle.piClass = 'pi pi-times';
        statusStyle.colorStyle = "color: red";
        statusStyle.severity = "danger";
        break;
      }
      case 'FAILED': {
        statusStyle.piClass = 'pi pi-times';
        statusStyle.colorStyle = "color: red";
        statusStyle.severity = "danger";
        break;
      }
      default: {
        statusStyle.piClass = 'pi pi-question'
        statusStyle.colorStyle = "color: slateblue";
        statusStyle.severity = "secondary";
        break;
      }
    }
    return statusStyle;
  }
}
