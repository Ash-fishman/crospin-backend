import { Type } from '@nestjs/common'
import { Route, Routes } from 'nest-router'
import { AppModule } from './modules/app/app.module'
import { HealthcheckModule } from './modules/healthcheck/healthcheck.module'
import { ReconciliationModule } from './modules/reconciliation/reconciliation.module'

export const routes: Routes = [
  {
    path: '/',
    children: [
      { module: AppModule, path: '/auth' },
      { module: HealthcheckModule, path: '/healthcheck' },
      { module: ReconciliationModule, path: '/reconciliation' },
    ],
  },
]

export const controllersModules: Array<Type> = (
  routes[0].children as Route[]
).map((c) => c.module as Type)
