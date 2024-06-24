import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedAiModels, TensorboardLogs, AiModel } from './ai-model';
import { Job } from '../job/job';
import { DataService } from '../data-service';

@Injectable({
  providedIn: 'root'
})
export class AiModelService implements DataService<AiModel, PaginatedAiModels> {

  private AiModelUrl = environment.apiRootUrl + '/AiModels';
  private tensorboardLogsUrl = environment.apiRootUrl + '/tensorboardLogs';

  constructor(private http: HttpClient) { }

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
        result.data = result._embedded.AiModels;
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
        result.data = result._embedded.AiModels;
        return result;
      }));
  }

  getJob(jobUrl: string): Observable<Job> {
    return this.http.get<Job>(jobUrl);
  }

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

  makePublicAiModel(AiModel: AiModel): Observable<AiModel> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<AiModel>(`${this.AiModelUrl}/${AiModel.id}`, {publiclyShared: true}, httpOptions);
  }

  startDownload(url: string): Observable<string> {
    return this.http.get<string>(url);
  }
}
