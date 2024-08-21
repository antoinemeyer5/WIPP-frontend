import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AiModelCard } from '../ai-model-card/ai-model-card';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AiModelCardService {

  private AiModelCardUrl = environment.apiRootUrl + '/aiModelCards';

  constructor(private http: HttpClient) { }

  /***** GET *****/

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

  exportCDCS(id: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.AiModelCardUrl}/${id}/export/cdcs`, { observe: 'response', responseType: 'blob' });
  }

  /***** PATCH *****/

  updateAiModelCard(aiModelCard: AiModelCard): Observable<AiModelCard> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
    };
    return this.http.patch<AiModelCard>(`${this.AiModelCardUrl}/${aiModelCard['id']}`, aiModelCard, httpOptions);
  }

  /***** POST *****/

  /*uploadCDCS(id: string): Observable<AiModelCard> {
    let url = "http://129.6.58.34/rest/data/";
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS'
    };
    const body = {
      title: "test",
      template: 1,
      workspace: null,
      content: "{\"id\":\"12789\",\"version\":\"0.1.1\",\"aiModelId\":\"1\",\"name\":\"Minimal example thrug API\",\"date\":\"2024-08-20\",\"framework\":\"tensorflow\"}"
    };
    return this.http.post<AiModelCard>(url, body, { headers });
  }*/

}
