import { Injectable } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

@Injectable({
    providedIn: 'root'
})
export class FiltersService {
    editFilterTabs: { [key: string]: boolean } = {};
    dropdownLists: { [key: string]: any[] } = {};
    selectedItems: { [key: string]: any[] } = {};
    dropdownSettings: { [key: string]: any } = {};

    dtElement: DataTableDirective | undefined;

    /**
        * Inicializa los filtros desplegables (Pueden ser unicos o de selección multiple).
        * @param key Un identificador único para el filtro desplegable.
        * @param itemTexts Una matriz de cadenas que representan el texto de cada elemento desplegable.
        * @param isSingleSelection Un valor booleano que indica si el menú desplegable permite selecciones únicas o múltiples. El valor predeterminado es falso (se permiten múltiples selecciones).
    */
    initializeDropdowns(key: string, itemTexts: string[], isSingleSelection: boolean = false) {
        this.editFilterTabs[key] = false;

        // Ajustar configuración basada en si es selección simple o múltiple
        this.dropdownSettings[key] = {
            singleSelection: isSingleSelection,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Seleccionar Todo',
            unSelectAllText: 'Deseleccionar Todo',
            searchPlaceholderText: 'Buscar elemento...',
            noDataAvailablePlaceholderText: 'No hay datos disponibles',
            noFilteredDataAvailablePlaceholderText: 'No se encontraron resultados',
            itemsShowLimit: 4,
            allowSearchFilter: true,
            closeDropDownOnSelection: isSingleSelection
        };

        // Inicializar lista de opciones y selecciones para este dropdown
        this.dropdownLists[key] = itemTexts.map((text, index) => ({
            item_id: index,
            item_text: text
        }));

        this.selectedItems[key] = [...this.dropdownLists[key]];
    }

    /**
     * Selecciona un item basado en el texto del item.
     * @param key La clave del dropdown en el que buscar.
     * @param itemName El texto del item a seleccionar.
     */
    selectItemByName(key: string, itemName: string): void {
        // Encuentra el item en la lista de opciones basado en el texto del item.
        const item = this.dropdownLists[key].find(item => item.item_text === itemName);

        if (item) {
            // Si el dropdown está configurado para selección simple, reemplaza la selección actual.
            if (this.dropdownSettings[key].singleSelection) {
                this.selectedItems[key] = [item];
            } else {
                // Para selección múltiple, añade el item a los ya seleccionados, asegurando no duplicar items.
                if (!this.selectedItems[key].some(selectedItem => selectedItem.item_id === item.item_id)) {
                    this.selectedItems[key].push(item);
                }
            }
        }
    }
    
    /**
         * Selecciona el primer item de la lista de opciones para una clave específica.
         * @param key La clave del dropdown en el que seleccionar el primer item.
         */
    selectFirstItem(key: string): void {
        // Verifica si existe al menos un item en la lista de opciones.
        if (this.dropdownLists[key] && this.dropdownLists[key].length > 0) {
            const firstItem = this.dropdownLists[key][0]; // Obtiene el primer item.

            // Si el dropdown está configurado para selección simple, establece el primer item como el único seleccionado.
            if (this.dropdownSettings[key].singleSelection) {
                this.selectedItems[key] = [firstItem];
            } else {
                this.selectedItems[key] = [firstItem];
            }
        }
    }
    
    public setDtElement(dtElement: DataTableDirective): void {
        this.dtElement = dtElement;
    }

    public openFilters(key: string) {
        this.editFilterTabs[key] = !this.editFilterTabs[key];
    }

    public onItemSelect(item: any): void {
        this.toggleColumn(item.item_id, true);
    }

    public onItemDeSelect(item: any): void {
        this.toggleColumn(item.item_id, false);
    }

    public onSelectAll(key: string): void {
        this.dropdownLists[key].forEach((item: any) => this.toggleColumn(item.item_id, true));
    }

    public onDeSelectAll(key: string): void {
        this.dropdownLists[key].forEach((item: any) => this.toggleColumn(item.item_id, false));
    }

    public toggleColumn(id: number, isVisible: boolean): void {
        this.dtElement?.dtInstance.then((dtInstance: DataTables.Api) => {
            const column = dtInstance.column(id);
            column.visible(isVisible);
        });
    }
}
