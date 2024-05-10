import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {forkJoin, Observable, of as observableOf} from 'rxjs';
import {ImagesCollection, PaginatedImagesCollections} from './images-collection';
import {map} from 'rxjs/operators';
import {Image, PaginatedImages} from './image';
import {MetadataFile, PaginatedMetadataFiles} from './metadata-file';
import {environment} from '../../environments/environment';
import {Job} from '../job/job';
import {DataService} from '../data-service';
import {Pyramid} from '../pyramid/pyramid';

@Injectable({
  providedIn: 'root'
})
export class ImagesCollectionService implements DataService<ImagesCollection, PaginatedImagesCollections> {

  private imagesCollectionsUrl = environment.apiRootUrl + '/imagesCollections';
  private annotationsUrl = environment.apiRootUrl + '/cVATDatasetAnnotationses';
  private timePattern = '(.*)(\\{[t]+\\})(.*)';
  constructor(
    private http: HttpClient
  ) {
  }

  getById(id: string): Observable<ImagesCollection> {
    return this.http.get<ImagesCollection>(`${this.imagesCollectionsUrl}/${id}`);
  }

  get(params): Observable<PaginatedImagesCollections> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      const httpParams = new HttpParams().set('page', page).set('size', size).set('sort', sort);
      httpOptions.params = httpParams;
    }
    return this.http.get<any>(this.imagesCollectionsUrl, httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.imagesCollections;
        return result;
      }));
  }

  getByNameContainingIgnoreCase(params, name): Observable<PaginatedImagesCollections> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    let httpParams = new HttpParams().set('name', name);
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      httpParams = httpParams.set('page', page).set('size', size).set('sort', sort);
    }
    httpOptions.params = httpParams;
    return this.http.get<any>(this.imagesCollectionsUrl + '/search/findByNameContainingIgnoreCase', httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.imagesCollections;
        return result;
      }));
  }

  getImagesCollectionsByNameContainingIgnoreCaseAndNumberOfImages(params, name, nbOfImgs): Observable<PaginatedImagesCollections> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    let httpParams = new HttpParams().set('name', name).set('numberOfImages', nbOfImgs);
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      httpParams = httpParams.set('page', page).set('size', size).set('sort', sort);
    }
    httpOptions.params = httpParams;
    return this.http.get<any>(this.imagesCollectionsUrl + '/search/findByNameContainingIgnoreCaseAndNumberOfImages', httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.imagesCollections;
        return result;
      }));
  }

  setImagesCollectionName(imagesCollection: ImagesCollection, name: string): Observable<ImagesCollection> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<ImagesCollection>(`${this.imagesCollectionsUrl}/${imagesCollection.id}`, {name: name}, httpOptions);
  }

  setImagesCollectionNotes(imagesCollection: ImagesCollection, notes: string): Observable<ImagesCollection> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<ImagesCollection>(`${this.imagesCollectionsUrl}/${imagesCollection.id}`, {notes: notes}, httpOptions);
  }

  getImages(imagesCollection: ImagesCollection, params): Observable<PaginatedImages> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      const httpParams = new HttpParams().set('page', page).set('size', size).set('sort', sort);
      httpOptions.params = httpParams;
    }
    return this.http.get<any>(`${this.imagesCollectionsUrl}/${imagesCollection.id}/images`, httpOptions).pipe(
      map((result: any) => {
        console.log(result); // <--it's an object
        if (result['_embedded']) {
          result.data = result._embedded.images;
        } else {
          result.data = [];
        }
        return result;
      }));
  }

  getImagesByRegex(imagesCollection: ImagesCollection, regex: string, params): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    let httpParams = new HttpParams().set('regex', regex);
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      httpParams = httpParams.set('page', page).set('size', size).set('sort', sort);
      httpOptions.params = httpParams;
    }
    return this.http.get<any>(`${this.imagesCollectionsUrl}/${imagesCollection.id}/images/filterByFileNameRegex`,
      httpOptions).pipe(
      map((result: any) => {
        if (result['_embedded']) {
          result.data = result._embedded.images;
        } else {
          result.data = [];
        }
        return result;
      }));
  }

  getImagesByTimePattern(imagesCollection: ImagesCollection, timePattern: string, params): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    let httpParams = new HttpParams().set('timePattern', timePattern);
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      httpParams = httpParams.set('page', page).set('size', size).set('sort', sort);
      httpOptions.params = httpParams;
    }
    return this.http.get<any>(`${this.imagesCollectionsUrl}/${imagesCollection.id}/images/filterByFileNameTimePattern`,
      httpOptions).pipe(
      map((result: any) => {
        if (result['_embedded']) {
          result.data = result._embedded.images;
        } else {
          result.data = [];
        }
        return result;
      }));
  }

  getMetadataFiles(imagesCollection: ImagesCollection, params): Observable<PaginatedMetadataFiles> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      const httpParams = new HttpParams().set('page', page).set('size', size).set('sort', sort);
      httpOptions.params = httpParams;
    }
    return this.http.get<any>(`${this.imagesCollectionsUrl}/${imagesCollection.id}/metadataFiles`, httpOptions).pipe(
      map((result: any) => {
        if (result['_embedded']) {
          result.data = result._embedded.metadataFiles;
        } else {
          result.data = [];
        }
        return result;
      }));
  }

  createImagesCollection(imagesCollection: ImagesCollection): Observable<ImagesCollection> {
    return this.http.post<ImagesCollection>(this.imagesCollectionsUrl, imagesCollection);
  }

  batchImportImagesCollections(configuration: any): Observable<String> {
    return this.http.post<any>(`${this.imagesCollectionsUrl}/batch-import`, configuration);
  }

  deleteImagesCollection(imagesCollection: ImagesCollection) {
    return this.http.delete<ImagesCollection>(imagesCollection._links.self.href);
  }

  deleteImage(image: Image) {
    return this.http.delete<Image>(image._links.self.href);
  }

  deleteAllImages(imagesCollection: ImagesCollection) {
    if (imagesCollection.numberOfImages > 0) {
      return this.http.delete(`${this.imagesCollectionsUrl}/${imagesCollection.id}/images`);
    }
  }

  deleteMetadataFile(metadata: MetadataFile) {
    return this.http.delete<Image>(metadata._links.self.href);
  }

  deleteAllMetadataFiles(imagesCollection: ImagesCollection) {
    if (imagesCollection.numberOfMetadataFiles > 0) {
      return this.http.delete(`${this.imagesCollectionsUrl}/${imagesCollection.id}/metadataFiles`);
    }
  }

  makePublicImagesCollection(imagesCollection: ImagesCollection): Observable<ImagesCollection> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<ImagesCollection>(`${this.imagesCollectionsUrl}/${imagesCollection.id}`, {publiclyShared: true}, httpOptions);
  }

  lockImagesCollection(imagesCollection: ImagesCollection): Observable<ImagesCollection> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<ImagesCollection>(`${this.imagesCollectionsUrl}/${imagesCollection.id}`, {locked: true}, httpOptions);
  }

  getImagesUrl(imagesCollection: ImagesCollection): string {
    return `${this.imagesCollectionsUrl}/${imagesCollection.id}/images`;
  }

  getMetadataFilesUrl(imagesCollection: ImagesCollection): string {
    return `${this.imagesCollectionsUrl}/${imagesCollection.id}/metadataFiles`;
  }

  getSourceJob(imagesCollection: ImagesCollection): Observable<Job> {
    if (imagesCollection._links['sourceJob']) {
      return this.http.get<Job>(imagesCollection._links['sourceJob']['href']);
    }
    return observableOf(null);
  }

  startDownload(url: string): Observable<string> {
    return this.http.get<string>(url);
  }

  getIiifLayerManifest(imagesCollection: ImagesCollection, layerConf: any): any {
    const contrastParam = layerConf.displayConfig.contrast ? layerConf.displayConfig.contrast : '1';
    const colorMapParam = layerConf.displayConfig.colorMap ? ('&CMP=' + layerConf.displayConfig.colorMap) : '';
    const invertParam = layerConf.displayConfig.invert ? layerConf.displayConfig.invert : '';
    const manifest = {
      'layersGroups': [{
        'id': imagesCollection.id,
        'name': imagesCollection.name,
        'layers': [{
          'id': imagesCollection.id,
          'name': imagesCollection.name,
          'baseUrl': environment.iipRootUrl
            + '?CNT='
            + contrastParam
            + colorMapParam
            + invertParam
            + '&IIIF='
            + imagesCollection.id + '/images',
          'filenamePattern': layerConf.filenamePattern,
          'framesPrefix': '',
          'framesSuffix': '.ome.tif/info.json',
          'framesOffset': -1,
          'openOnFrame': 1,
          'numberOfFrames': 5,
          'paddingSize': 1,
          'displayConfig': layerConf.displayConfig
          // 'fetching': {
          //   'url': imagesCollection._links.fetching.href
          // },
          // 'pyramidAnnotations': {
          //   'serviceUrl': this.pyramidAnnotationsUrl
          // }
        }]
      }]
    };
    const layer: any = manifest.layersGroups[0].layers[0];
    const timePatternRegex = new RegExp(this.timePattern);
    const regexp = new RegExp(this.convertFilenameTimePatternToRegex(layerConf.filenamePattern));

    return forkJoin(
      this.getImagesByTimePattern(imagesCollection, layerConf.filenamePattern, {
        size: 1,
        sort: 'fileName,asc'
      }),
      this.getImagesByTimePattern(imagesCollection, layerConf.filenamePattern, {
        size: 1,
        sort: 'fileName,desc'
      }))
      .pipe(
        map(results => {
          layer.numberOfFrames = results[0].page.totalElements;
          for (let i = 0; i < results.length; i++) {
            if (results[i].data) {
              results[i] = results[i].data;
            } else {
              throw Error('No time slice found.');
            }
          }
          return results;
        }),
        map(timeSlicesArray => {
          const firstTimeSlice = timeSlicesArray[0][0];
          console.log(regexp.exec(firstTimeSlice.fileName));
          firstTimeSlice.name = regexp.exec(firstTimeSlice.fileName)[2];
          const firstTimeSliceNumber = Number(firstTimeSlice.name);
          if (isNaN(firstTimeSliceNumber)) {
            layer.baseUrl = firstTimeSlice._links.dzi.href;
            layer.singleFrame = true;
          }
          const lastTimeSlice = timeSlicesArray[1][0];
          lastTimeSlice.name = regexp.exec(lastTimeSlice.fileName)[2];
          const lastTimeSliceNumber = Number(lastTimeSlice.name);

          layer.framesPrefix = timePatternRegex.exec(layerConf.filenamePattern)[1];
          layer.framesSuffix = timePatternRegex.exec(layerConf.filenamePattern)[3] + '/info.json';
          layer.paddingSize = firstTimeSlice.name.length;

          if (lastTimeSliceNumber - firstTimeSliceNumber + 1 ===
            layer.numberOfFrames) {
            layer.framesOffset = firstTimeSliceNumber - 1;
          } else {
            return this.getImagesByRegex(imagesCollection, layerConf.filenamePattern,{
              size: layer.numberOfFrames
            }).pipe(
              map(resource => resource.data),
              map(timeSlices => {
                layer.numberOfFrames = lastTimeSliceNumber;
                layer.framesList = timeSlices.map(function (timeSlice) {
                  timeSlice['name'] = regexp.exec(timeSlice.fileName)[2];
                  return Number(timeSlice['name']);
                });
                return firstTimeSlice;
              }));
          }
          return firstTimeSlice;
        }),
        map( data => {
          console.log(manifest);
          return manifest;
        }));
  }

  // MIST time pattern to regex converter
  convertFilenameTimePatternToRegex(filenamePattern: string): string {
    const timePatternRegex = new RegExp(this.timePattern);
    const matches = timePatternRegex.exec(filenamePattern);
    if (matches.length !== 4) {
      throw Error('Invalid filename pattern.');
    }
    // group 0 = entire string,
    // group 1 = prefix
    // group 2 = {tttt}
    // group 3 = suffix
    const prefix = matches[1];
    const tCount = matches[2].length - 2;
    const suffix = matches[3];

    return '(' + prefix + ')(\\d{' + tCount + '})(' + suffix + ')';
  }

  // WIP annotations
  // annotateCollection(imagesCollection: ImagesCollection, labels: string): Observable<any> {
  //   const httpOptions = {
  //     headers: new HttpHeaders({'Content-Type': 'application/json'}),
  //     params: {}
  //   };
  //   return this.http.post<ImagesCollection>(`${this.imagesCollectionsUrl}/${imagesCollection.id}/annotate`, labels, httpOptions);
  // }
  //
  // getCollectionAnnotations(imagesCollection: ImagesCollection): Observable<any> {
  //   const httpParams = new HttpParams().set('imagesCollection', imagesCollection.id);
  //   const httpOptions = {
  //     headers: new HttpHeaders({'Content-Type': 'application/json'}),
  //     params: httpParams
  //   };
  //   return this.http.get<any>(`${this.annotationsUrl}/search/findByImagesCollection`, httpOptions);
  // }
  //
  // downloadAnnotation(url: string): Observable<any> {
  //   console.log(url);
  //   return this.http.get<any>(url);
  // }

}
