import { Injectable } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

@Injectable({
    providedIn: 'root'
})
export class FiltersServicexml {
    editFilterTabs: boolean = false;
    dropdownList: any = [];
    selectedItems: any = [];

    dtElement: DataTableDirective | undefined;
    dropdownSettings: any = {};

    initializeDropdowns(itemTexts: string[], dtElement: DataTableDirective) {
        this.dtElement = dtElement;
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            searchPlaceholderText: 'Buscar elemento...',
            selectAllText: 'Seleccionar Todo',
            unSelectAllText: 'Deseleccionar Todo',
            noDataAvailablePlaceholderText: 'No hay datos disponibles',
            noFilteredDataAvailablePlaceholderText: 'No se encontraron resultados',
            itemsShowLimit: 4,
            allowSearchFilter: true
        };
        this.dropdownList = itemTexts.map((text, index) => ({
            item_id: index,
            item_text: text
        }));

        this.selectedItems = [...this.dropdownList];
    }

    public openFilters() {
        this.editFilterTabs = !this.editFilterTabs;
    }

    public onItemSelect(item: any): void {
        this.toggleColumn(item.item_id, true);
    }

    public onSelectAll(items: any): void {
        items.forEach((item: any) => this.toggleColumn(item.item_id, true));
    }

    public onItemDeSelect(item: any): void {
        this.toggleColumn(item.item_id, false);
    }

    public onDeSelectAll(items: any): void {
        this.dropdownList.forEach((item: any) => this.toggleColumn(item.item_id, false));
    }

    public toggleColumn(id: number, isVisible: boolean): void {
        this.dtElement?.dtInstance.then((dtInstance: DataTables.Api) => {
            const column = dtInstance.column(id);
            column.visible(isVisible);
        });
    }
}
