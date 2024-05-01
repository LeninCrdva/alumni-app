import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Injectable({
    providedIn: 'root',
})
export class DataTablesService {

    dtoptions: DataTables.Settings = {};

    constructor() { }

    setupDtOptions(columnTitles: string[], searchPlaceholder: string, includeActionsColumn: boolean = true) {
        const columns = columnTitles.map(title => ({ title }));
        if (includeActionsColumn) {
            columns.push({ title: 'Acciones' });
        }
        return {
            pagingType: 'full_numbers',
            searching: true,
            lengthChange: true,
            columns,
            language: {
                search: 'Buscar:',
                searchPlaceholder,
                info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
                infoEmpty: 'Mostrando 0 a 0 de 0 registros',
                paginate: {
                    first: 'Primera',
                    last: 'Última',
                    next: 'Siguiente',
                    previous: 'Anterior',
                },
                lengthMenu: 'Mostrar _MENU_ registros por página',
                zeroRecords: 'No se encontraron registros coincidentes',
            },
            lengthMenu: [10, 25, 50],
        };
    }

    rerender(dtElement: DataTableDirective | undefined, dtTrigger: Subject<any>): void {
        dtElement?.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            dtTrigger.next(null);
        });
    }
}
