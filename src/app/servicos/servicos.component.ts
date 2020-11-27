import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

declare var $: any;


declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}


@Component({
    selector: 'app-servicos',
    templateUrl: './servicos.component.html',
    styleUrls: ['./servicos.component.scss']
})

// nome
// id_servico
// valor_servico
// fk_profissional

export class ServicosComponent implements OnInit {

    public httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('token')
        })
    };


    public tableData1: TableData;
    public tableData2: TableData;

    public users = [];
    public filterUsers = [];
    public pageUsers = [];

    constructor(public router: Router,
                public http: HttpClient) {
    }

    ngOnInit() {
        this.loadServices();
    }

    addServicoOnclick() {
        this.router.navigate(['servicos/addServico']);
    }


    editService(row) {
        this.router.navigate(['/servicos/' + row[0] + '/Editar']);
    }

    loadServices() {
        const apiRoute = environment.url + 'services/';
        const request = this.http.get(apiRoute, this.httpOptions);
        request.subscribe(
            (response) => {
                const services = response['services'];
                const rows = [];
                for (const service of services) {
                    const row = [service['identifier'], service['name'], service['professional']];
                    rows.push(row);
                }

                this.users = rows;
                this.filterUsers = rows;
                this.setPageUsers(1);
            }, (err) => {
                console.log(err);
            }
        );
    }

    onKey(event: KeyboardEvent) {
        const atualSearch = (<HTMLInputElement>event.target).value;
        this.filterByName(atualSearch);
    }

    public filterByName(name: string) {
        this.filterUsers = this.users.filter(
            (elem) => {
                return elem[1].toLowerCase().includes(name.toLowerCase().trim());
            }
        );

        this.setPageUsers(1);
    }

    getPages() {
        if (this.filterUsers) {
            const numberOfPages = Math.ceil((this.filterUsers.length / 7));
            const pages = [];
            for (let i = 0; i < numberOfPages; i++) {
                pages[i] = (i + 1).toString();
            }
            return pages;
        } else {
            return [1];
        }
    }

    setPageUsers(pageNumber: any) {
        if (this.filterUsers !== undefined) {
            if (((pageNumber - 1) * 5) + 5 < this.filterUsers.length) {
                this.pageUsers = this.filterUsers.slice((pageNumber - 1) * 7, ((pageNumber - 1) * 7) + 7);
            } else {
                this.pageUsers = this.filterUsers.slice((pageNumber - 1) * 7, this.filterUsers.length);
            }
        }

        this.tableData1 = {
            headerRow: ['ID', 'Nome', 'Profissional'],
            dataRows: this.pageUsers
        };

        $('li').removeClass('active');
        $('#' + pageNumber).addClass('active');
    }


}
