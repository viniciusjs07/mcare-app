import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';


declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}


@Component({
    selector: 'app-profissional-de-saude',
    templateUrl: './profissional-de-saude.component.html',
    styleUrls: ['./profissional-de-saude.component.scss']
})
export class ProfissionalDeSaudeComponent implements OnInit {

    public httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('token')
        })
    };

    public tableData1: TableData;

    constructor(public router: Router,
                public http: HttpClient) {
    }

    ngOnInit() {
        this.loadProfessionals();
    }

    addProfissionalOnclick() {
        this.router.navigate(['profissionais/addProfissional']);
    }

    loadProfessionals() {
        const apiRoute = environment.url + 'professionals/';
        const request = this.http.get(apiRoute, this.httpOptions);
        request.subscribe(
            (response) => {
                const professionals = response['professionals'];
                const rows = [];
                let id = 1;
                for (const professional of professionals) {
                    if (professional['name'] !== 'Administrador') {
                        const row = [id, professional['name'], professional['role'], professional['expertise'], professional['phone']];
                        id = id + 1;
                        rows.push(row);
                    }
                }
                this.tableData1 = {
                    headerRow: ['ID', 'Nome', 'Função', 'Especialidade', 'Contato'],
                    dataRows: rows
                };
            }, (err) => {
                console.log(err);
            }
        );
    }
}
