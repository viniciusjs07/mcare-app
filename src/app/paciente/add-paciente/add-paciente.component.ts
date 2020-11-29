import {Component, OnInit} from '@angular/core';
import {NotificacoesService} from 'app/servicos/notificacoes.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {trim} from '../../shared/util/trim-field';

declare var $: any;

@Component({
    selector: 'app-add-paciente',
    templateUrl: './add-paciente.component.html',
    styleUrls: ['./add-paciente.component.scss']
})

export class AddPacienteComponent implements OnInit {

    public httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('token')
        })
    };

    public patientId: String;
    public history = [];

    addForm: FormGroup;
    signalsForm: FormGroup;
    signalsId = '';

    constructor(
        public router: Router,
        public _notificationService: NotificacoesService,
        public http: HttpClient
    ) {
    }

    ngOnInit() {
        this.loadForm();
    }

    isAddForm() {
        const url = window.location.href.split('/')[4];
        return url === 'addPaciente';
    }

    isEditForm() {
        const url = window.location.href.split('/')[5];
        return url === 'Editar';
    }

  /**
   * Removed line white of values form before save patient
   */
  validateForm() {
        trim('company', this.addForm);
    }

    registerPatientOnClick() {
        this.validateForm();
        const apiUrl = environment.url + 'patients/create';
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
                    this.router.navigate(['./pacientes']);
                }, (err) => {
                    this._notificationService.showNotification(
                        'top',
                        'right',
                        'Erro ao cadastrar paciente. Verifique se as informações estão corretas',
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

    openSignalsModal(id) {
        this.signalFormInicialization();
        this.signalsId = id;
        this.loadSignals();
        $('#signalsModal').appendTo('body').modal('show');
    }

    public loadSignals() {
        const apiRoute = environment.url + 'services/scheduling/signals/' + this.signalsId;
        const request = this.http.get(apiRoute, this.httpOptions);

        request.subscribe(
            (response) => {
                for (const key of SINGALS_KEYS) {
                    this.signalsForm.get(key).setValue(response[key]);
                    this.signalsForm.get(key).disable();
                }
            }, (err) => {
                console.log(err);
            }
        );
    }

    showLocalPain() {
        return this.signalsForm.value['pain'] !== '';
    }

    getServicesString(services) {
        if (services.length === 1) {
            return services[0]['name'];
        } else {
            let serviceString = '';
            for (const service of services) {
                serviceString = serviceString + service['name'] + ', ';
            }

            serviceString = serviceString.slice(0, serviceString.length - 2);
            return serviceString;
        }
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

    cancelOnClick() {
        this._notificationService.showNotification(
            'top',
            'right',
            'Procedimento cancelado.',
            3,
            'pe-7s-check'
        );
        this.router.navigate(['./pacientes']);
    }

    useMedicine() {
        return this.addForm.value['userMedicine'] === 'Sim';
    }

    loadHistory() {
        const patientName = window.location.href.split('/')[4];
        const apiUrl = environment.url + 'patients/history/' + patientName;
        const request = this.http.get(apiUrl, this.httpOptions);

        request.subscribe(
            (response) => {
                this.history = response['patientSchedules'];
            }, (err) => {
                console.log(err);
            }
        );
    }

    loaddedForm() {
        const patientName = window.location.href.split('/')[4];
        const apiUrl = environment.url + 'patients/' + patientName;
        const request = this.http.get(apiUrl, this.httpOptions);
        const isEdit = this.isEditForm();

        request.subscribe(
            (response) => {
                this.patientId = response['patient']['_id'];
                for (const key of FORM_KEYS) {
                    this.addForm.get(key).setValue(response['patient'][key]);
                    if (!isEdit) {
                        this.addForm.get(key).disable();
                    }
                }
            }, (err) => {
                console.log(err);
            }
        );

        this.loadHistory();
    }

    updatePatient() {
        this.validateForm();
        const apiRoute = environment.url + 'patients/' + this.patientId;
        const request = this.http.put(apiRoute, this.addForm.value, this.httpOptions);
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
                    this.router.navigate(['./pacientes']);
                }, (err) => {
                    this._notificationService.showNotification(
                        'top',
                        'right',
                        'Erro ao atualizar Paciente. ' + err['message'],
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

    public loadForm() {
        this.addForm = new FormGroup({
            name: new FormControl('', [
                Validators.required
            ]),
            gender: new FormControl('', [
                Validators.required
            ]),
            birthdate: new FormControl('', [
                Validators.required
            ]),
            city: new FormControl('', [
                Validators.required
            ]),
            address: new FormControl('', [
                Validators.required
            ]),
            phone: new FormControl('', [
                Validators.required
            ]),
            company: new FormControl('', [
                Validators.required
            ]),
            email: new FormControl('', []),
            country: new FormControl('', []),
            cep: new FormControl('', []),
            otherInfo: new FormControl('', []),
            allergy: new FormControl('', [
                Validators.required
            ]),
            userMedicine: new FormControl('', [
                Validators.required
            ]),
            medicineDescription: new FormControl('', []),
            diabetic: new FormControl('', [
                Validators.required
            ]),
            hypertensive: new FormControl('', [
                Validators.required
            ]),
            heartDisease: new FormControl('', [
                Validators.required
            ]),
            pneumonia: new FormControl('', [
                Validators.required
            ]),
            asthma: new FormControl('', [
                Validators.required
            ]),
            hyperthyroidism: new FormControl('', [
                Validators.required
            ]),
            smoking: new FormControl('', [
                Validators.required
            ]),
            alcoholism: new FormControl('', [
                Validators.required
            ])
        });
        if (!this.isAddForm()) {
            this.loaddedForm();
        }
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
}

const FORM_KEYS = ['name', 'gender', 'birthdate', 'city', 'address', 'phone',
    'email', 'country', 'cep', 'otherInfo', 'allergy', 'userMedicine',
    'medicineDescription', 'diabetic', 'hypertensive', 'heartDisease', 'pneumonia', 'asthma',
    'hyperthyroidism', 'smoking', 'alcoholism', 'company'];
const SINGALS_KEYS = ['bloodPressure', 'heartFrequency', 'breathFrequency', 'temperature', 'pain', 'localPain', 'weight', 'height'];
