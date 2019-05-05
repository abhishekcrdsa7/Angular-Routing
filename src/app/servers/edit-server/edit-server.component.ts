import { Component, OnInit } from '@angular/core';
import {Params, ActivatedRoute, Router} from '@angular/router';

import { ServersService } from '../servers.service';
import {CanComponentDeactivate} from '../../can-deactivate-guard.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-edit-server',
  templateUrl: './edit-server.component.html',
  styleUrls: ['./edit-server.component.css']
})
export class EditServerComponent implements OnInit, CanComponentDeactivate {
  server: {id: number, name: string, status: string};
  serverName = '';
  serverStatus = '';
  allowedEdit = false;
  changesSaved = false;

  constructor(private serversService: ServersService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.server.id = this.route.snapshot.params['id'];
    this.server = this.serversService.getServer(this.server.id);
    this.route.params
      .subscribe(
        (params: Params) => {
          this.server.id = params['id'];
          this.server = this.serversService.getServer(this.server.id);
          this.serverName = this.server.name;
          this.serverStatus = this.server.status;
        }
      );
    this.route.queryParams
    .subscribe(
      (query: Params) => {
        this.allowedEdit = query.allowEdit == 1;
      }
    );
  }

  onUpdateServer() {
    this.serversService.updateServer(this.server.id, {name: this.serverName, status: this.serverStatus});
    this.changesSaved = true;
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.allowedEdit) {
      return true;
    }

    if (!this.changesSaved) {
      return confirm('Do you want to leave without saving the changes?');
    } else {
      return true;
    }
  }

}
