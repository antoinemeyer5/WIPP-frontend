import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedAiModels, TensorboardLogs, AiModel } from './ai-model';
import { Job } from '../job/job';
import { DataService } from '../data-service';
import { AiModelCard } from './ai-model-card';

@Injectable({
  providedIn: 'root'
})
export class AiModelService implements DataService<AiModel, PaginatedAiModels> {

  private AiModelUrl = environment.apiRootUrl + '/aiModels';
  private AiModelCardUrl = environment.apiRootUrl + '/modelCards';
  private tensorboardLogsUrl = environment.apiRootUrl + '/tensorboardLogs';

  constructor(private http: HttpClient) { }

  getJob(jobUrl: string): Observable<Job> {
    return this.http.get<Job>(jobUrl);
  }

  /***** AI Model Services *****/

  getById(id: string): Observable<AiModel> {
    return this.http.get<AiModel>(`${this.AiModelUrl}/${id}`);
  }

  get(params): Observable<PaginatedAiModels> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
    };
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      const httpParams = new HttpParams().set('page', page).set('size', size).set('sort', sort);
      httpOptions.params = httpParams;
    }
    return this.http.get<any>(this.AiModelUrl, httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.aiModels;
        return result;
      }));
  }

  getByNameContainingIgnoreCase(params, name): Observable<PaginatedAiModels> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
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
    return this.http.get<any>(this.AiModelUrl + '/search/findByNameContainingIgnoreCase', httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.aiModels;
        return result;
      }));
  }

  makePublicAiModel(AiModel: AiModel): Observable<AiModel> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
    };
    return this.http.patch<AiModel>(`${this.AiModelUrl}/${AiModel.id}`, { publiclyShared: true }, httpOptions);
  }

  startDownload(url: string): Observable<string> {
    return this.http.get<string>(url);
  }

  /***** AI Model Card Services *****/

  getAiModelCard(aiModelId: string): Observable<AiModelCard> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: new HttpParams().set('aiModelId', aiModelId)
    };
    return this.http.get<AiModelCard>(`${this.AiModelCardUrl}/search/findModelCardByAiModelId`, httpOptions);
  }

  exportTensorflow(id: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.AiModelCardUrl}/${id}/export/tensorflow`, { observe: 'response', responseType: 'blob' });
  }

  exportHuggingface(id: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.AiModelCardUrl}/${id}/export/huggingface`, { observe: 'response', responseType: 'blob' });
  }

  exportBioimageio(id: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.AiModelCardUrl}/${id}/export/bioimageio`, { observe: 'response', responseType: 'blob' });
  }

  updateAiModelCard(aiModelCard: AiModelCard): Observable<AiModelCard> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
    };
    return this.http.patch<AiModelCard>(`${this.AiModelCardUrl}/${aiModelCard['id']}`, aiModelCard, httpOptions);
  }

  /***** TensorBoard Services *****/

  getTensorboardLogsByJob(jobId: string): Observable<TensorboardLogs> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
    };
    const httpParams = new HttpParams().set('sourceJob', jobId);
    httpOptions.params = httpParams;
    return this.http.get<any>(this.tensorboardLogsUrl + '/search/findOneBySourceJob', httpOptions).pipe(
      map((result: any) => {
        return result;
      }));
  }

  getTensorboardlogsCSV(id: string, type: string, tag: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: new HttpParams().set('type', type).set('tag', tag)
    };
    return this.http.get<any>(`${this.tensorboardLogsUrl}/${id}/get/csv`, httpOptions);
  }

}
