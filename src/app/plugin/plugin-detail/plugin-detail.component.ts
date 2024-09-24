import { Component, OnDestroy, OnInit } from '@angular/core';
import {PluginService} from '../plugin.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Plugin} from '../plugin';
import {KeycloakService} from '../../services/keycloak/keycloak.service';
import {DialogService} from 'primeng/dynamicdialog';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-plugin-detail',
  templateUrl: './plugin-detail.component.html',
  styleUrls: ['./plugin-detail.component.css'],
  providers: [DialogService, ConfirmationService]
})
export class PluginDetailComponent implements OnInit, OnDestroy {

  constructor(private pluginService: PluginService,
              private dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private route: ActivatedRoute,
              private router: Router,
              private keycloakService: KeycloakService
  ) {}

  plugin: Plugin = new Plugin();
  expandedInput: JSON[] | null;
  manifest: JSON | null;
  resourceRequirements: any[] = [];
  showManifest: boolean = false;

  ngOnInit() {
    this.getPlugin();
  }

  getPlugin(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.pluginService.getPlugin(id)
      .subscribe(plugin => {
        this.plugin = plugin;
        this.curateManifest();
        this.generateResourceRequirementsArray()
      }, error => {
        this.router.navigate(['/404']);
      });
  }

  getInputUi(inputName: string) {
    const inputKey = 'inputs.' + inputName;
    return this.plugin.ui.find(ui => ui['key'] === inputKey);
  }

  curateManifest() {
    const pluginCopy = JSON.parse(JSON.stringify(this.plugin));
    delete pluginCopy.id;
    delete pluginCopy.creationDate;
    delete pluginCopy._links;
    this.manifest = pluginCopy;
  }

  generateResourceRequirementsArray() {
    let pluginResourceRequirements = this.plugin?.resourceRequirements
    this.resourceRequirements.push({
      'name': "ramMin",
      'description': "Minimum RAM in mebibytes (Mi)",
      'value': pluginResourceRequirements?.ramMin || 'N/A'
    });
    this.resourceRequirements.push({
      'name': "coresMin",
      'description': "Minimum number of CPU cores",
      'value': pluginResourceRequirements?.coresMin || 'N/A'
    });
    this.resourceRequirements.push({
      'name': "cpuAVX",
      'description': "Advanced Vector Extensions (AVX) CPU capability required",
      'value': pluginResourceRequirements?.cpuAVX || 'N/A'
    });
    this.resourceRequirements.push({
      'name': "cpuAVX2",
      'description': "Advanced Vector Extensions 2 (AVX2) CPU capability required",
      'value': pluginResourceRequirements?.cpuAVX2 || 'N/A'
    });
    this.resourceRequirements.push({
      'name': "gpu",
      'description': "GPU/accelerator required",
      'value': pluginResourceRequirements?.gpu || 'N/A'
    });
    this.resourceRequirements.push({
      'name': "cudaRequirements.deviceMemoryMin",
      'description': "GPU Cuda-related requirements - deviceMemoryMin",
      'value': pluginResourceRequirements?.cudaRequirements?.deviceMemoryMin || 'N/A'
    });
    this.resourceRequirements.push({
      'name': "cudaRequirements.cudaComputeCapability",
      'description': "GPU Cuda-related requirements - cudaComputeCapability",
      'value': pluginResourceRequirements?.cudaRequirements?.cudaComputeCapability || 'N/A'
    });
  }

  displayManifest() {
    this.showManifest = true;
  }

  canEdit() {
    return (this.keycloakService.isLoggedIn()
      && (this.keycloakService.hasRole('admin') || this.keycloakService.hasRole('developer')));
  }

  deletePlugin(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the plugin ' + this.plugin.name + ' v' + this.plugin.version + '?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
        this.pluginService.deletePlugin(this.plugin).subscribe(plugin => {
          this.router.navigate(['plugins']);
        });
      }
    });
  }

  ngOnDestroy() {
    this.dialogService.dialogComponentRefMap.forEach((dialog) => dialog.destroy());
  }

}
