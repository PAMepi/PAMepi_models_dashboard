import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent implements OnInit {
  @Output() controllerEvent: EventEmitter<any> = new EventEmitter();

  @Output() loading!: boolean;

  constructor(private loaderService: LoaderService) {
    this.loaderService.isLoading.subscribe((res) => {
      console.log(res);
      this.loading = res;
      if (res == true) {
        this.controllerEvent.emit();
      }
    });
  }

  ngOnInit(): void {}
}
