import {Component, OnInit, ElementRef} from '@angular/core';
import {ROUTES} from '../../sidebar/sidebar.component';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

@Component({
    // moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {
    public listTitles: any[];
    location: Location;
    public toggleButton: any;
    public sidebarVisible: boolean;

    constructor(location: Location, public element: ElementRef) {
        this.location = location;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        this.listTitles = ROUTES.filter(listTitle => listTitle);
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);
        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };

    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };

    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };

    getTitle() {
        let titlee = this.location.prepareExternalUrl(this.location.path());
        titlee = titlee.split('/').pop();
        for (let item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].path === titlee) {
                return this.listTitles[item].title;
            }
        }

        switch (titlee) {
            case 'relatorios': {
                titlee = 'Relatorios';
                break;
            }
            case 'pacientes': {
                titlee = 'Pacientes';
                break;
            }
            case 'agendamentos': {
                titlee = 'Agendamentos';
                break;
            }
            case 'servicos': {
                titlee = 'Serviços';
                break;
            }
            case 'funcionarios': {
                titlee = 'Funcionários';
                break;
            }
            case 'profissionais': {
                titlee = 'Profissionais';
                break;
            }
            case 'addPaciente': {
                titlee = 'Adiciona Paciente';
                break;
            }
            case 'addAgendamento': {
                titlee = 'Adiciona Agendamento';
                break;
            }

            case 'addServico': {
                titlee = 'Adiciona Serviço';
                break;
            }
            case 'addFuncionario': {
                titlee = 'Adiciona Funcionário';
                break;
            }
            case 'addProfissional': {
                titlee = 'Adiciona Profissional';
                break;
            }
            case 'dashboard': {
                titlee = 'Dashboard';
                break;
            }
            default: {
                // statements;
                break;
            }
        }
        return titlee;
    }

    logout() {
        localStorage.setItem('token', '');
        localStorage.setItem('_type', '');
    }
}
