import { Component, EventEmitter, Output } from '@angular/core';

export interface FileUploadContent {
  file: File;
  value: string;
}

@Component({
  selector: 'app-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss']
})
export class UploadButtonComponent {

  @Output() private importDone: EventEmitter<FileUploadContent> = new EventEmitter();

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        // this will then display a text file
        this.importDone.emit({
          file: file,
          value: reader.result as string
        });
      }, false);
      reader.readAsText(file);
    }
  }
}
