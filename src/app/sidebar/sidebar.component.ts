import {Component, OnInit} from '@angular/core';

declare const $: any;

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    {path: '/pacientes', title: 'Pacientes', icon: 'pe-7s-users', class: ''},
    {path: '/agendamentos', title: 'Agendamentos', icon: 'pe-7s-note2', class: ''},
    {path: '/Exames', title: 'Exames', icon: 'pe-7s-eyedropper', class: ''},
    {path: '/servicos', title: 'Serviços', icon: 'pe-7s-photo-gallery', class: ''},
    {path: '/funcionarios', title: 'Funcionários', icon: 'pe-7s-user', class: ''},
    {path: '/profissionais', title: 'Profissionais', icon: 'pe-7s-portfolio', class: ''},
    {path: '/Planos', title: 'Planos de Saúde', icon: 'pe-7s-note2', class: ''},
    {path: '/relatorios', title: 'Relatórios', icon: 'pe-7s-graph', class: ''}
];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
    menuItems: any[];

    constructor() {
    }

    ngOnInit() {
        this.menuItems = (atob(localStorage.getItem('_type')) === 'Professional') ?
            ProfessionalROUTES.filter(menuItem => menuItem) : ROUTES.filter(menuItem => menuItem);
    }

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };
}

const ProfessionalROUTES: RouteInfo[] = [
    {path: '/pacientes', title: 'Pacientes', icon: 'pe-7s-users', class: ''},
    {path: '/agendamentos', title: 'Agendamentos', icon: 'pe-7s-note2', class: ''},
    {path: '/Exames', title: 'Exames', icon: 'pe-7s-eyedropper', class: ''},
];

