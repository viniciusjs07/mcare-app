import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NotificacoesService} from 'app/servicos/notificacoes.service';
import {PrecricaoService} from './precricao.service';

declare var $: any;

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
    tailRows: string[];
}


@Component({
    selector: 'app-agendamentos',
    templateUrl: './agendamentos.component.html',
    styleUrls: ['./agendamentos.component.scss']
})


export class AgendamentosComponent implements OnInit {

    statusForm = new FormGroup({
        status: new FormControl('', [
            Validators.required
        ]),
        _id: new FormControl('', [])
    });

    priorityForm = new FormGroup({
        priorityQueue: new FormControl('', [])
    });

    professionals = [];

    signalsForm: FormGroup;
    clinicalStoryForm: FormGroup;

    showLoad = false;

    public httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('token')
        })
    };

    public tableData1: TableData;

    public users = [];
    public usersTails = [];
    public filterUsers = [];
    public filterTails = [];
    public pageUsers = [];
    public pageTails = [];

    public removeId: string;
    public signalsId: string;
    public priorityId: string;
    public clinicalStoryId: string;
    public prescPatient: string;
    public prescProfessional: string;
    public selectedProfessional = '';

    constructor(public router: Router,
                public http: HttpClient,
                public _notificationService: NotificacoesService,
                public prescService: PrecricaoService) {
    }

    ngOnInit() {
        const id = 'defaultProf';
        $('#professionals option').filter(function () {
            return this.id === id
        }).prop('selected', true);

        this.professionals = [];
        this.loadProfessionals();

        if (this.isProfessional) {
            this.selectedProfessional = 'Profissional';
            this.loadSchedulings('Aguardando');
        }
    }

    setSelectedProfessional(professionaName) {
        this.selectedProfessional = professionaName;
        this.loadSchedulings('Aguardando');
    }

    addAgendamentoOnclick() {
        this.router.navigate(['agendamentos/addAgendamento']);
    }

    loadSchedulings(status) {
        this.showLoad = true;
        const apiRoute = environment.url + 'services/scheduling/all/' + this.selectedProfessional;
        const request = this.http.get(apiRoute, this.httpOptions);
        request.subscribe(
            (response) => {
                const schedules = response['schedules'];
                console.log(response['schedules']);
                const rows = [];
                const tails = [];
                for (const schedule of schedules) {
                    if (schedule['status'] === status) {
                        const row = this.isProfessional() ? [this.formatDate(schedule['date']), schedule['patient'], schedule['services']]
                            : [this.formatDate(schedule['date']), schedule['patient'], schedule['professional'], schedule['services']];
                        rows.push(row);
                        const tail = [schedule['_id'], schedule['status'],
                            schedule['patient'], schedule['clinicalStory'], schedule['priorityQueue']];
                        tails.push(tail);
                    }
                }

                this.users = rows;
                this.usersTails = tails;
                this.filterUsers = rows;
                this.filterTails = tails;

                this.setPageUsers(1);
                this.setNavActive(status);
            }, (err) => {
                console.log(err);
                this.showLoad = false;
            }
        );
    }

    public setNavActive(status) {

        $('#status1').removeClass('active');
        $('#status2').removeClass('active');
        $('#status3').removeClass('active');

        if (status === 'Aguardando') {
            $('#status1').addClass('active');
        } else if (status === 'Atendido') {
            $('#status2').addClass('active');
        } else {
            $('#status3').addClass('active');
        }
        this.showLoad = false;
    }

    public formatDate(date) {
        if (date != null) {
            const splitted = date.split('-', 3);

            const year = splitted[0];
            const month = splitted[1];
            const day = splitted[2];

            return day + '/' + month + '/' + year;
        }
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
        this.filterTails = this.usersTails.filter(
            (elem) => {
                return elem[4].toLowerCase().includes(name.toLowerCase().trim());
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
                this.pageTails = this.filterTails.slice((pageNumber - 1) * 7, ((pageNumber - 1) * 7) + 7);
            } else {
                this.pageUsers = this.filterUsers.slice((pageNumber - 1) * 7, this.filterUsers.length);
                this.pageTails = this.filterTails.slice((pageNumber - 1) * 7, this.filterUsers.length);
            }
        }

        this.tableData1 = {
            headerRow: this.isProfessional() ? ['Data', 'Paciente', 'Serviços'] : ['Data', 'Paciente', 'Profissional', 'Serviços'],
            dataRows: this.pageUsers,
            tailRows: this.pageTails
        };

        $('.page-item').removeClass('active');
        $('#' + pageNumber).addClass('active');
    }


    openModal(index) {
        const schedulingDetails = this.pageTails[index];
        this.statusForm.get('_id').setValue(schedulingDetails[0]);
        this.statusForm.get('status').setValue(schedulingDetails[3]);
        $('#myModal').appendTo('body').modal('show');
    }

    updateSchedulingStatus() {
        this.updateScheduling(this.statusForm.value, this.statusForm.value['_id']);
    }

    updateSchedulingSignals() {
        this.updateScheduling(this.signalsForm.value, this.signalsId);
    }

    updateClinicalStory() {
        this.updateScheduling(this.clinicalStoryForm.value, this.clinicalStoryId);
    }

    finishScheduling(index) {
        const scheduleId = this.pageTails[index][0];
        this.updateScheduling({status: 'Atendido'}, scheduleId);
    }

    editSchedule(index) {
        this.router.navigate(['agendamentos/' + this.pageTails[index][0] + '/Editar']);
    }

    public updateScheduling(body, scheduleId) {
        const apiUrl = environment.url + 'services/scheduling/' + scheduleId;
        const request = this.http.put(apiUrl, body, this.httpOptions);
        request.subscribe(
            (response) => {
                this._notificationService.showNotification(
                    'top',
                    'right',
                    'Agendamento atualizado com sucesso.',
                    2,
                    'pe-7s-check'
                );
                this.ngOnInit();
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

    showDeleteButton(index) {
        const schedulingDetails = this.pageTails[index];
        return (schedulingDetails[3] === 'Não Atendido');
    }

    showOrderButton(index) {
        const schedulingDetails = this.pageTails[index];
        return (schedulingDetails[3] === 'Aguardando');
    }

    showFinishButton(index) {
        const schedulingDetails = this.pageTails[index];
        return (schedulingDetails[3] === 'Aguardando');
    }

    openDeleteModal(index) {
        this.removeId = this.pageTails[index][0];
        $('#removeModal').appendTo('body').modal('show');
    }

    openPriorityModal(index) {
        this.priorityId = this.pageTails[index][0];
        const priorityValue = this.pageTails[index][6];
        this.priorityForm.get('priorityQueue').setValue(priorityValue);
        if (this.isProfessional()) {
            this.priorityForm.get('priorityQueue').disable();
        }
        $('#priorityModal').appendTo('body').modal('show');
    }

    savePriority() {
        this.updateScheduling(this.priorityForm.value, this.priorityId);
        this.loadSchedulings('Aguardando');
    }

    openSignalsModal(index) {
        this.signalFormInicialization();
        this.signalsId = this.pageTails[index][0];
        if (this.isProfessional()) {
            this.loadSignals(true);
        } else {
            this.loadSignals(false);
        }
        $('#signalsModal').appendTo('body').modal('show');
    }

    public loadSignals(disabled: boolean) {
        const apiRoute = environment.url + 'services/scheduling/signals/' + this.signalsId;
        const request = this.http.get(apiRoute, this.httpOptions);

        request.subscribe(
            (response) => {
                for (let key of SINGALS_KEYS) {
                    this.signalsForm.get(key).setValue(response[key]);
                    if (disabled) {
                        this.signalsForm.get(key).disable();
                    }
                }
            }, (err) => {
                console.log(err);
            }
        );
    }

    openMedicalModal(index) {
        this.prescPatient = this.pageUsers[index][1];
        this.prescProfessional = this.pageUsers[index][2]
        $('#medicalModal').appendTo('body').modal('show');
    }

    openClinicalModal(index) {
        this.clinicalStoryFormInicialization();
        this.clinicalStoryId = this.pageTails[index][0];
        if (this.pageTails[index][5]) {
            this.clinicalStoryForm.get('clinicalStory').setValue(this.pageTails[index][5]);
        }
        $('#clinicalModal').appendTo('body').modal('show');
    }

    confirmDelete() {
        const apiRoute = environment.url + 'services/scheduling/' + this.removeId;
        const request = this.http.delete(apiRoute, this.httpOptions);
        request.subscribe(
            (response) => {
                this._notificationService.showNotification(
                    'top',
                    'right',
                    'Agendamento removido.',
                    2,
                    'pe-7s-check'
                );
                this.ngOnInit();
            }, (err) => {
                this._notificationService.showNotification(
                    'top',
                    'right',
                    'Ocorreu um erro ao remover agendamento.',
                    4,
                    'pe-7s-close'
                );
                window.location.reload();
            }
        );
    }

    canRemoveScheduling() {
        return (atob(localStorage.getItem('_type')) !== 'Professional');
    }

    showLocalPain() {
        return this.signalsForm.value['pain'] !== '';
    }

    showPatientDetails(index) {
        const patient = this.pageUsers[index][1];
        this.router.navigate(['/pacientes/' + patient + '/Detalhes']);
    }

    isProfessional() {
        return (atob(localStorage.getItem('_type')) === 'Professional');
    }

    generatePDF() {
        const element = <HTMLTextAreaElement>document.getElementById('clinicalText');
        this.prescService.setPrescriptAttributes(this.prescProfessional, this.prescPatient, element.value);
        this.router.navigate(['/agendamentos/prescricao/PDF'])
    }


    public signalFormInicialization() {
        this.signalsForm = new FormGroup({
            bloodPressure: new FormControl('', []),
            heartFrequency: new FormControl('', []),
            breathFrequency: new FormControl('', []),
            temperature: new FormControl('', []),
            pain: new FormControl('', []),
            localPain: new FormControl('', []),
            weight: new FormControl('', []),
            height: new FormControl('', [])
        });
    }


    public clinicalStoryFormInicialization() {
        this.clinicalStoryForm = new FormGroup({
            clinicalStory: new FormControl('', [])
        });
    }
}

const SINGALS_KEYS = ['bloodPressure', 'heartFrequency', 'breathFrequency', 'temperature', 'pain', 'localPain', 'weight', 'height'];
