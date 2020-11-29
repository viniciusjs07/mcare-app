import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'app-funcionarios',
    templateUrl: './funcionarios.component.html',
    styleUrls: ['./funcionarios.component.scss']
})

export class FuncionariosComponent implements OnInit {

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
        this.loadEmployers();
    }

    addFuncionarioOnclick() {
        this.router.navigate(['funcionarios/addFuncionario']);
    }

    loadEmployers() {
        const apiRoute = environment.url + 'employers/';
        const request = this.http.get(apiRoute, this.httpOptions);
        request.subscribe(
            (response) => {
                console.log(response);
                const employers = response['employers'];
                const rows = [];
                let id = 1;
                for (const employer of employers) {
                    if (employer['name'] !== 'Administrador') {
                        const row = [id, employer['name'], employer['role'], employer['gender'], employer['phone']];
                        id = id + 1;
                        rows.push(row);
                    }
                }
                this.tableData1 = {
                    headerRow: ['ID', 'Nome', 'Função', 'Sexo', 'Contato'],
                    dataRows: rows
                };
            }, (err) => {
                console.log(err);
            }
        );
    }


}
