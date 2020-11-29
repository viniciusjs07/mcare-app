import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NotificacoesService} from '../notificacoes.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';


@Component({
    selector: 'app-add-servico',
    templateUrl: './add-servico.component.html',
    styleUrls: ['./add-servico.component.scss']
})
export class AddServicoComponent implements OnInit {

    public httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('token')
        })
    };

    addForm = new FormGroup({
        name: new FormControl('', [
            Validators.required
        ]),
        identifier: new FormControl('', [
            Validators.required
        ]),
        professional_name: new FormControl('', [
            Validators.required
        ]),
        other: new FormControl('', [])
    });

    public professionals = [];
    public editProfessional = '';


    constructor(
        public router: Router,
        public _notificationService: NotificacoesService,
        public http: HttpClient
    ) {
    }

    ngOnInit() {
        this.selectMode();
    }

    cadastrarOnClick() {
        const apiUrl = environment.url + 'services/register';
        const request = this.http.post(apiUrl, this.addForm.value, this.httpOptions);

        if (this.addForm.valid) {
            request.subscribe(
                (response) => {
                    this._notificationService.showNotification(
                        'top',
                        'right',
                        response['message'],
                        2,
                        'pe-7s-check'
                    );
                    this.router.navigate(['./servicos']);
                }, (err) => {
                    this._notificationService.showNotification(
                        'top',
                        'right',
                        'Erro ao cadastrar serviço. Verifique se as informações estão corretas',
                        4,
                        'pe-7s-close'
                    );
                }
            );
        } else {
            this._notificationService.showNotification(
                'top',
                'right',
                'Formulário inválido ou incompleto. Corrija as informações e tente novamente.',
                4,
                'pe-7s-close'
            );
        }
    }

    isEditMode() {
        return window.location.href.split('/')[5] === 'Editar';
    }

    cancelarOnClick() {
        this._notificationService.showNotification(
            'top',
            'right',
            'Procedimento cancelado.',
            3,
            'pe-7s-check'
        );
        this.router.navigate(['./servicos']);
    }

    updateService() {
        const apiRoute = environment.url + 'services/' + window.location.href.split('/')[4];
        const request = this.http.put(apiRoute, this.addForm.value, this.httpOptions);
        request.subscribe(
            (response) => {
                this._notificationService.showNotification(
                    'top',
                    'right',
                    response['message'],
                    2,
                    'pe-7s-check'
                );
                this.router.navigate(['./servicos']);
            }, (err) => {
                this._notificationService.showNotification(
                    'top',
                    'right',
                    'Erro ao atualizar serviço. Verifique se as informações estão corretas',
                    4,
                    'pe-7s-close'
                );
            });
    }

    public loadService() {
        const serviceId = window.location.href.split('/')[4];
        const apiRoute = environment.url + 'services/get/' + serviceId;
        const request = this.http.get(apiRoute, this.httpOptions);

        request.subscribe(
            (response) => {
                for (const key of FORM_KEYS) {
                    this.addForm.get(key).setValue(response['service'][key]);
                }
                this.editProfessional = response['service']['professional'];
                this.loadProfessionals();
            }, (err) => {
                console.log(err);
            }
        );
    }

    public selectMode() {
        if (this.isEditMode()) {
            this.loadService();
        } else {
            this.loadProfessionals();
        }
    }

    public loadProfessionals() {
        const apiRoute = environment.url + 'professionals/';
        const request = this.http.get(apiRoute, this.httpOptions);
        request.subscribe(
            (response) => {
                this.professionals = response['professionals'];
                for (const professional of response['professionals']) {
                    if (professional['_id'] === this.editProfessional) {
                        this.addForm.get('professional_name').setValue(professional['name']);
                    }
                }
            }, (err) => {
                console.log(err);
            }
        );
    }
}

const FORM_KEYS = ['name', 'identifier', 'other'];
