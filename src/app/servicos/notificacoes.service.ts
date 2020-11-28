import {Injectable} from '@angular/core';

declare var $: any;

@Injectable({
    providedIn: 'root'
})

export class NotificacoesService {

    constructor() {
    }

    showNotification(from, align, mensagem, cor, icone) {
        // const type = ['','info','success','warning','danger'];
        const type = ['', 'info', 'success', 'warning', 'danger'];

        const color = cor;
        $.notify({
            icon: icone,
            message: mensagem
        }, {
            type: type[color],
            timer: 1000,
            placement: {
                from: from,
                align: align
            }
        });
    }

}
