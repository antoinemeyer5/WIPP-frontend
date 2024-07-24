import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import {Notebook} from '../notebook';
import {ActivatedRoute, Router} from '@angular/router';
import {NotebookService} from '../notebook.service';
import 'prismjs';
import * as Prism from 'prismjs';
import * as Marked from 'marked';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-julia';
import 'prismjs/components/prism-matlab';
import 'prismjs/components/prism-r';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-scala';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import {HttpClient} from '@angular/common/http';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-notebook-detail',
  templateUrl: './notebook-detail.component.html',
  styleUrls: ['./notebook-detail.component.css'],
  providers: [MessageService]
})
export class NotebookDetailComponent implements OnInit {
  notebook: Notebook = new Notebook();
  notebookId = this.route.snapshot.paramMap.get('id');
  notebookJson: string;
  @ViewChild('notebookDisplay') notebookDisplay: ElementRef;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient,
    private notebookService: NotebookService,
    private renderer: Renderer2,
  ) {
  }

  ngOnInit() {
    this.notebookService.getById(this.notebookId).subscribe(notebook => {
      this.notebook = notebook;
      this.notebookService.getNotebookFile(this.notebookId)
        .subscribe(notebookJson => {
            this.notebookJson = notebookJson;
            this.displayNotebook();
          },
          error => {
            this.loading = false;
            this.messageService.add({ severity: 'error', summary: 'Error while loading the notebook file', detail: error.error.message });
          }
        );
      }, error => {
        this.router.navigate(['/404']);
      }
    );
  }

  displayNotebook() {
    const notebook = nb.parse(this.notebookJson);
    nb.markdown = function (text) {
      return Marked(text);
    };
    this.renderer.appendChild(this.notebookDisplay.nativeElement, notebook.render());
    Prism.highlightAll();
    this.loading = false;
  }
}
