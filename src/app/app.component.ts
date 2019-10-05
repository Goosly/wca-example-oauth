import { Component } from '@angular/core';
import { ApiService } from '../common/api';
declare var $ :any;

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  appState : 'LOGGEDOUT' | 'LOGGEDIN' | 'SELECTEDCOMP' = 'LOGGEDOUT';

  // Info about competitions managed by user
  competitionsToChooseFrom: Array<String> = null;
  competitionId: string;
  numberOfEvents: number;
  wcif: any;
  
  constructor (public apiService: ApiService) {
      if (this.apiService.oauthToken) {
        this.handleGetCompetitions();
      }
  }

  handleLoginToWca() {
    this.apiService.logIn();
  }

  handleGetCompetitions() {
    this.apiService.getCompetitions().subscribe(comps => {
      if (comps.length === 1) {
        this.handleCompetitionSelected(comps[0]['id']);
      }
      this.competitionsToChooseFrom = comps.map(c => c['id']);
    });
  }

  handleCompetitionSelected(competitionId: string) {
    this.competitionId = competitionId;
    this.apiService.getWcif(this.competitionId).subscribe(wcif => {
      this.wcif = wcif;
      try {
        this.numberOfEvents = this.wcif["events"].length;
      } catch (error) {
        console.error(error);
        this.wcif = null;
        this.competitionId = null;
      }
    });
  }

}
