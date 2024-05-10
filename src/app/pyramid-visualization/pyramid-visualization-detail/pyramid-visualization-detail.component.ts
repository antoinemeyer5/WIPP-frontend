import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {forkJoin, Observable, of} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {Visualization} from '../visualization';
import {NgbModal, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {PyramidService} from '../../pyramid/pyramid.service';
import {PyramidVisualizationService} from '../pyramid-visualization.service';
import {PyramidVisualizationHelpComponent} from '../pyramid-visualization-help/pyramid-visualization-help.component';
import {ModalErrorComponent} from '../../modal-error/modal-error.component';
import {KeycloakService} from '../../services/keycloak/keycloak.service'
import {ImagesCollectionService} from '../../images-collection/images-collection.service';
import {SelectItem} from 'primeng/api';

@Component({
  selector: 'app-pyramid-visualization-detail',
  templateUrl: './pyramid-visualization-detail.component.html',
  styleUrls: ['./pyramid-visualization-detail.component.css']
})
export class PyramidVisualizationDetailComponent implements OnInit, OnDestroy {

  visualizationId = this.route.snapshot.paramMap.get('id');
  visualization: Visualization = new Visualization();
  manifest: any = null;
  newGroup = {};
  layersGroups = [];
  showSettings = false;
  savedStatus = 'saved';

  colorMapOptions: SelectItem[];
  colorMapField: string;

  contrastOptions: SelectItem[];
  contrastField: string;

  invertOptions: SelectItem[];
  invertField: string;

  @ViewChild('instance') instance: NgbTypeahead;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private pyramidService: PyramidService,
    private imagesCollectionService: ImagesCollectionService,
    private visualizationService: PyramidVisualizationService,
    private keycloakService: KeycloakService
    ) {
  }

  ngOnInit() {
    this.visualizationService.getVisualization(this.visualizationId)
      .subscribe(visualization => {
        this.visualization = visualization;
        this.colorMapOptions = [
          { label: 'NONE', value: '' },
          { label: 'GREY', value: 'GREY' },
          { label: 'JET', value: 'JET' },
          { label: 'COLD', value: 'COLD' },
          { label: 'HOT', value: 'HOT' },
          { label: 'RED', value: 'RED' },
          { label: 'GREEN', value: 'GREEN' },
          { label: 'BLUE', value: 'BLUE' }
        ];
        this.contrastOptions = [
          { label: 'NONE', value: '1' },
          { label: 'STRETCH', value: 'ST' },
          { label: 'EQUALIZATION', value: 'EQ' },
          { label: 'x2', value: '2' },
          { label: 'x10', value: '10' },
          { label: 'x100', value: '100' }
        ];
        this.invertOptions = [
          { label: 'NO', value: '' },
          { label: 'YES', value: '&INV' }
        ];
        this.loadManifest();
      }, error => {
        this.router.navigate(['/404']);
      });
  }

  loadManifest() {
    if (!this.visualization.manifest) {
      this.manifest = {
        'layersGroups': []
      };
      this.showSettings = true;
      return;
    }
    this.manifest = this.visualization.manifest;
    const self = this;

    this.layersGroups = this.manifest.layersGroups.map(function (group) {
      return {
        label: group.id,
        layers: group.layers.map(function (layer) {
          const result = {
            label: layer.id,
            // TODO : handle metadata (not handled in pyramid building yet)
            // ppm: layer.scalebar.pixelsPerMeter,
            pyramid: {},
            displayConfig: {},
            filenamePattern: null
          };
          if (self.visualization.iiifDataSource === true) {
            self.imagesCollectionService.getById(layer.imagesCollectionId)
              .subscribe(function (pyramid) {
                result.pyramid = pyramid;
              });
            result.displayConfig = layer.displayConfig;
            result.filenamePattern = layer.filenamePattern;
          } else { // handle backward compatibility with legacy pyramids
            self.pyramidService.getPyramidFromBaseUrl(layer.baseUrl)
              .subscribe(function (pyramid) {
                result.pyramid = pyramid;
              });
          }
          return result;
        }),
        newLayer: {}
      };
    });
  }

  updateManifest() {
    this.savedStatus = 'saving';
    this.getLayersGroups().subscribe(layersGroupsManifests => {
      this.manifest = {
        'layersGroups': layersGroupsManifests
      };
      this.visualizationService.setVisualizationManifest(
        this.visualization, this.manifest).subscribe(result => {
        this.savedStatus = 'saved';
      }, error => {
        this.savedStatus = 'error';
        const modalRefErr = this.modalService.open(ModalErrorComponent);
        modalRefErr.componentInstance.title = 'Cannot save configuration.';
        modalRefErr.componentInstance.message =
          'The configuration can not be saved on the server.<br>' +
          'Your recent modifications won\'t be available when you leave ' +
          'this page and come back later.';
      });
    });
  }

  getLayersGroups() {
    if (this.layersGroups.length === 0) {
      return of([]);
    } else {
      return forkJoin(this.layersGroups.map(layerGroup => {
        return this.getLayers(layerGroup).pipe(map(layersManifest => {
          return {
            id: layerGroup.label,
            name: layerGroup.label,
            layers: layersManifest
          };
        }));
      }));
    }
  }

  getLayers(layerGroup) {
    if (layerGroup.layers.length === 0) {
      return of([]);
    } else {
      return forkJoin(layerGroup.layers.map(layer => {
        console.log(layer);
        return this.imagesCollectionService.getIiifLayerManifest(layer.pyramid, layer)
          .pipe(map(manifest => {
            const layerManifest = manifest['layersGroups'][0].layers[0];
            layerManifest.id = layer.label;
            layerManifest.name = layer.label;
            layerManifest.imagesCollectionId = layer.pyramid.id;
            if (layer.ppm) {
              layerManifest.scalebar = {
                pixelsPerMeter: layer.ppm,
                unitType: 'length'
              };
            }
            return layerManifest;
          }));
      }));
    }
  }

  addGroup() {
    this.layersGroups.push({
      label: this.newGroup['label'],
      layers: [],
      newLayer: {}
    });
    this.newGroup = {};
    this.updateManifest();
  }

  addLayer(group) {
    group.layers.push({
      label: group.newLayer.label,
      pyramid: group.newLayer.pyramid,
      displayConfig: {
        contrast : group.newLayer.contrastField,
        colorMap : group.newLayer.colorMapField,
        invert : group.newLayer.invertField,
      },
      filenamePattern: group.newLayer.filenamePattern
      // ppm: group.newLayer.ppm,
      // acquiredIntensity: group.newLayer.acquiredIntensity
    });
    group.newLayer = {};
    this.updateManifest();
  }

  isNewLayerValid(group) {
    if (!group.newLayer) {
      return false;
    }
    const label = group.newLayer.label;
    if (!label) {
      return false;
    }

    const pyramid = group.newLayer.pyramid;
    if (!pyramid || !pyramid.id) {
      return false;
    }

    const duplicateLabel = this.getAllLayers().some(function (layer) {
      return layer.label === label;
    });
    if (duplicateLabel) {
      return false;
    }

    return true;
  }

  getAllLayers() {
    // flatMap
    return [].concat.apply([], this.layersGroups.map(function (group) {
      return group.layers;
    }));
  }

  isNewGroupValid() {
    if (!this.newGroup) {
      return false;
    }

    const label = this.newGroup['label'];
    if (!label) {
      return false;
    }

    const duplicateGroup = this.layersGroups.some(function (group) {
      return group.label === label;
    });
    if (duplicateGroup) {
      return false;
    }

    return true;
  }

  removeGroup(group) {
    const self = this;
    function doRemoveGroup() {
      const index = self.layersGroups.indexOf(group);
      if (index !== -1) {
        self.layersGroups.splice(index, 1);
        self.updateManifest();
      }
    }

    doRemoveGroup();
    // TODO: add confirmation dialogs
  }

  removeLayer(group, layer) {
    const index = group.layers.indexOf(layer);
    if (index !== -1) {
      group.layers.splice(index, 1);
      this.updateManifest();
    }
  }

  pyramidSelected(group) {
    const newLayer = group.newLayer;
    const pyramid = newLayer.pyramid;
    // TODO: handle metadata (not handled in pyramid building yet)
    // this.pyramidService.getPyramidMetadata(pyramid).then(
    //   function (metadata) {
    //     newLayer.ppm = metadata.pixelsPerMeter;
    //     newLayer.acquiredIntensity = metadata.acquiredIntensity;
    //   });
  }

  showHelp() {
    const modalRef = this.modalService.open(PyramidVisualizationHelpComponent, { size: 'lg', backdrop: 'static', keyboard: true });
    modalRef.componentInstance.modalReference = modalRef;
  }

  // Typeahead functions for pyramid search
  // filter(term) {
  //   return this.pyramidService.getByNameContainingIgnoreCase(null, term).pipe(map(paginatedResult => {
  //     return paginatedResult.data;
  //   }));
  // }
  filter(term) {
    return this.imagesCollectionService.getByNameContainingIgnoreCase(null, term).pipe(map(paginatedResult => {
      return paginatedResult.data;
    }));
  }
  search = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    switchMap(term => this.filter(term))
  )
  formatter = (x: {name: string}) => x.name;

  ngOnDestroy() {
    this.modalService.dismissAll();
  }

  makePublicVisualization(): void {
    this.visualizationService.makePublicVisualization(
      this.visualization).subscribe(visualization => {
      this.visualization = visualization;
    });
  }

  canEdit(): boolean {
    return this.keycloakService.canEdit(this.visualization) && this.visualization.iiifDataSource == true;
  }
}
