import { Routes } from '@angular/router';

import { HomeComponent } from '../../home/home.component';
import { UserComponent } from '../../user/user.component';
import { TablesComponent } from '../../tables/tables.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { PacienteComponent } from 'app/paciente/paciente.component';
import { FuncionariosComponent } from 'app/funcionarios/funcionarios.component';
import { ProfissionalDeSaudeComponent } from 'app/profissional-de-saude/profissional-de-saude.component';
import { ServicosComponent } from 'app/servicos/servicos.component';
import { AgendamentosComponent } from 'app/agendamentos/agendamentos.component';
import { AddPacienteComponent } from 'app/paciente/add-paciente/add-paciente.component';
import { AddAgendamentoComponent } from 'app/agendamentos/add-agendamento/add-agendamento.component';
import { AddServicoComponent } from 'app/servicos/add-servico/add-servico.component';
import { AddFuncionarioComponent } from 'app/funcionarios/add-funcionario/add-funcionario.component';
import { AddProfissionalComponent } from 'app/profissional-de-saude/add-profissional/add-profissional.component';
import { PrescricaoComponent } from 'app/agendamentos/prescricao/prescricao.component';
import { PlanoDeSaudeComponent } from 'app/plano-de-saude/plano-de-saude.component';
import { ExamesComponent } from 'app/exames/exames.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'relatorios',      component: HomeComponent },
    { path: 'user',           component: UserComponent },
    { path: 'table',          component: TablesComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'pacientes',  component: PacienteComponent},
    { path: 'pacientes/addPaciente',  component: AddPacienteComponent},
    { path: 'pacientes/:name/Detalhes',   component: AddPacienteComponent},
    { path: 'pacientes/:name/Editar',   component: AddPacienteComponent},
    { path: 'funcionarios',  component: FuncionariosComponent },
    { path: 'funcionarios/addFuncionario',  component: AddFuncionarioComponent },
    { path: 'profissionais',  component: ProfissionalDeSaudeComponent },
    { path: 'profissionais/addProfissional',  component: AddProfissionalComponent },
    { path: 'servicos',  component: ServicosComponent },
    { path: 'servicos/addServico',  component: AddServicoComponent },
    { path: 'servicos/:name/Editar', component: AddServicoComponent},
    { path: 'agendamentos',  component: AgendamentosComponent },
    { path: 'agendamentos/addAgendamento',  component: AddAgendamentoComponent},
    { path: 'agendamentos/:id/Editar',  component: AddAgendamentoComponent},
    { path: 'agendamentos/prescricao/PDF',  component: PrescricaoComponent},
    { path: 'Planos', component: PlanoDeSaudeComponent},
    { path: 'Exames', component: ExamesComponent}
];
