import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NotificacoesService} from 'app/servicos/notificacoes.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

declare var $: any;

@Component({
    selector: 'app-add-agendamento',
    templateUrl: './add-agendamento.component.html',
    styleUrls: ['./add-agendamento.component.scss']
})
export class AddAgendamentoComponent implements OnInit {

    public httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('token')
        })
    };

    addForm = new FormGroup({
        date: new FormControl('', [
            Validators.required
        ]),
        patient_name: new FormControl('', [
            Validators.required
        ]),
        professional_name: new FormControl('', [
            Validators.required
        ]),
        schedulingType: new FormControl('', [
            Validators.required
        ]),
        other: new FormControl('', []),
        services: new FormControl([], []),
        cidName: new FormControl('', []),
        ubsName: new FormControl('', []),
        schedulingTime: new FormControl('', [
            Validators.required
        ]),
    });


    public services = [];
    public checkedServices = [];
    public professionals = [];

    cidList = {
        names: [
            'CID 10 - Z57 - Exposição ocupacional a fatores de risco',
            'CID 10 - Z57.0 - Exposição ocupacional ao ruído',
            'CID 10 - Z57.1 - Exposição ocupacional a radiação',
            'CID 10 - Z57.2 - Exposição ocupacional a poeira(pó)',
            'CID 10 - Z57.3 - Exposição ocupacional a outros contaminantes do ar'
        ]
    };

    usbList = {
        names: [
            'UBS Antonio Arruda',
            'UBS Antonio Mesquita de Almeida',
            'UBS Campos Sales',
            'UBS Francisco Brasileiro',
            'UBS Horacina de Almeida',
            'UBS Jardim América I',
            'UBS Jardim América II',
            'UBS Jardim Tavares',
            'UBS Plínio Lemos',
            'UBS Tota Agra',
            'UBS Wesley Cariri Targino'
        ]
    };

    timesSchedule = {
        times: ['07:30', '08:10', '08:50', '09:30', '10:10', '13:00', '13:40', '14:20', '15:00', '15:40', '16:20']
    };

    constructor(
        readonly router: Router,
        readonly _notificationService: NotificacoesService,
        readonly http: HttpClient
    ) {
    }

    ngOnInit() {
        this.loadProfessionals();
        if (this.isEditMode()) {
            this.loadSchedule();
        }
    }

    isEditMode() {
        return window.location.href.split('/')[5] === 'Editar';
    }

    updateScheduling() {
        if (this.addServicesToForm()) {
            const apiUrl = environment.url + 'services/scheduling/' + window.location.href.split('/')[4];
            const request = this.http.put(apiUrl, this.addForm.value, this.httpOptions);
            request.subscribe(
                (response) => {
                    this._notificationService.showNotification(
                        'top',
                        'right',
                        'Agendamento atualizado com sucesso.',
                        2,
                        'pe-7s-check'
                    );
                    this.router.navigate(['./agendamentos']);
                }, (err) => {
                    this._notificationService.showNotification(
                        'top',
                        'right',
                        'Ocorreu um erro ao atualizar agendamento.',
                        4,
                        'pe-7s-close'
                    );
                }
            );
        }
    }

    registerScheduling() {
        if (this.addServicesToForm()) {
            const apiUrl = environment.url + 'services/scheduling/';
            const request = this.http.post(apiUrl, this.addForm.value, this.httpOptions);

            request.subscribe(
                (response) => {
                    this._notificationService.showNotification(
                        'top',
                        'right',
                        response['message'],
                        2,
                        'pe-7s-check'
                    );
                    this.router.navigate(['./agendamentos']);
                }, (err) => {
                    console.log(err);
                    this._notificationService.showNotification(
                        'top',
                        'right',
                        'Erro ao cadastrar agendamento. Verifique se as informações estão corretas',
                        4,
                        'pe-7s-close'
                    );
                    this.checkedServices = [];
                }
            );
        }
    }

    addServicesToForm() {
        if (this.checkedServices.length > 0) {
            const checkedIds = [];
            for (const service of this.checkedServices) {
                checkedIds.push(service['_id']);
            }
            this.addForm.get('services').setValue(checkedIds);
            return true;
        } else {
            this._notificationService.showNotification(
                'top',
                'right',
                'Por favor, preencha as informações corretamente.',
                4,
                'pe-7s-close'
            );
            this.services = [];
            this.checkedServices = [];
            return false;
        }
    }

    cancelScheduling() {
        this._notificationService.showNotification(
            'top',
            'right',
            'Cadastro cancelado.',
            3,
            'pe-7s-check'
        );
        this.router.navigate(['./agendamentos']);
    }

    cancelServiceSelect() {
        this.checkedServices = [];
    }

    openServicesModal() {
        if (this.addForm.valid) {
            this.loadServicesInformation();
        } else {
            this._notificationService.showNotification(
                'top',
                'right',
                'Formulário incompleto ou invalido.',
                4,
                'pe-7s-close'
            );
        }
    }

    onChangeCheckbox(service) {
        if (this.checkedServices.includes(service)) {
            this.removeFromChecked(service);
        } else {
            this.checkedServices.push(service);
        }
    }

    loadSchedule() {
        const id = window.location.href.split('/')[4];
        const apiRoute = environment.url + 'services/scheduling/' + id;

        const request = this.http.get(apiRoute, this.httpOptions);
        request.subscribe(
            (response) => {
                console.log('response update ', response);
                for (const key of FORM_KEYS) {
                    this.addForm.get(key).setValue(response['schedule'][key]);
                }
                this.addForm.get('professional_name').setValue(response['professional_name']);
                this.addForm.get('patient_name').setValue(response['patient_name']);
                console.log('get form ', this.addForm.value);
            }, (err) => {
                console.log(err);
            }
        );
    }

    public removeFromChecked(...forDeletion) {
        this.checkedServices = this.checkedServices.filter(item => !forDeletion.includes(item))
    }

    public loadProfessionals() {
        const apiRoute = environment.url + 'professionals/';
        const request = this.http.get(apiRoute, this.httpOptions);
        request.subscribe(
            (response) => {
                this.professionals = response['professionals'];
            }, (err) => {
                console.log(err);
            }
        );
    }

    public loadServicesInformation() {
        const apiRoute = environment.url + 'services/professional/' + this.addForm.value['professional_name'];
        const request = this.http.get(apiRoute, this.httpOptions);

        return request.subscribe(
            (response) => {
                this.services = response['services'];
                if (response['services'].length < 1) {
                    this._notificationService.showNotification(
                        'top',
                        'right',
                        'Nenhum serviço cadastrado para o profissional informado.',
                        4,
                        'pe-7s-close'
                    );
                } else {
                    $('#servicesModal').appendTo('body').modal('show');
                }
            }, (err) => {
                this._notificationService.showNotification(
                    'top',
                    'right',
                    err['error']['message'],
                    4,
                    'pe-7s-close'
                );
                console.log(err);
                return false;
            }
        );
    }
}

const FORM_KEYS = ['date', 'schedulingType', 'other', 'services', 'ubsName', 'cidName', 'schedulingTime'];
