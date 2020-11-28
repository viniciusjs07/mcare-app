import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {LbdModule} from '../../lbd/lbd.module';
import {NguiMapModule} from '@ngui/map';

import {AdminLayoutRoutes} from './admin-layout.routing';

import {HomeComponent} from '../../home/home.component';
import {UserComponent} from '../../user/user.component';
import {TablesComponent} from '../../tables/tables.component';
import {TypographyComponent} from '../../typography/typography.component';
import {IconsComponent} from '../../icons/icons.component';
import {MapsComponent} from '../../maps/maps.component';
import {NotificationsComponent} from '../../notifications/notifications.component';
import {PacienteComponent} from 'app/paciente/paciente.component';
import {FuncionariosComponent} from 'app/funcionarios/funcionarios.component';
import {ProfissionalDeSaudeComponent} from 'app/profissional-de-saude/profissional-de-saude.component';
import {ServicosComponent} from 'app/servicos/servicos.component';
import {AgendamentosComponent} from 'app/agendamentos/agendamentos.component';
import {AddPacienteComponent} from 'app/paciente/add-paciente/add-paciente.component';
import {AddAgendamentoComponent} from 'app/agendamentos/add-agendamento/add-agendamento.component';
import {AddServicoComponent} from 'app/servicos/add-servico/add-servico.component';
import {AddFuncionarioComponent} from 'app/funcionarios/add-funcionario/add-funcionario.component';
import {AddProfissionalComponent} from 'app/profissional-de-saude/add-profissional/add-profissional.component';
import {PrescricaoComponent} from 'app/agendamentos/prescricao/prescricao.component';
import {PrecricaoService} from '../../agendamentos/precricao.service';
import {PlanoDeSaudeComponent} from 'app/plano-de-saude/plano-de-saude.component';
import {ExamesComponent} from 'app/exames/exames.component';
import {DashboardComponent} from '../../dashboard/dashboard.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AdminLayoutRoutes),
        FormsModule,
        ReactiveFormsModule,
        LbdModule,
        NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=YOUR_KEY_HERE'})
    ],
    declarations: [
        HomeComponent,
        UserComponent,
        TablesComponent,
        TypographyComponent,
        IconsComponent,
        MapsComponent,
        NotificationsComponent,
        PacienteComponent,
        FuncionariosComponent,
        DashboardComponent,
        ProfissionalDeSaudeComponent,
        ServicosComponent,
        AgendamentosComponent,
        AddPacienteComponent,
        AddAgendamentoComponent,
        AddServicoComponent,
        AddFuncionarioComponent,
        AddProfissionalComponent,
        PrescricaoComponent,
        PlanoDeSaudeComponent,
        ExamesComponent
    ],
    providers: [PrecricaoService]
})

export class AdminLayoutModule {
}
