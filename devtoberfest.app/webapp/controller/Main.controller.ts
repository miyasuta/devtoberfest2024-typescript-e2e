import Table from "sap/m/Table";
import BaseController from "./BaseController";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import Sorter from "sap/ui/model/Sorter";
import { Icon$PressEvent } from "sap/ui/core/Icon";
import { ListItemBase$PressEvent } from "sap/m/ListItemBase";
import Panel from "sap/m/Panel";
import ODataContextBinding from "sap/ui/model/odata/v4/ODataContextBinding";
import { Button$PressEvent } from "sap/m/Button";
import MessageBox from "sap/m/MessageBox";

/**
 * @namespace devtoberfest.app.controller
 */
export default class Main extends BaseController {
	private _booksTalbe: Table;
	private _booksDetails: Panel;

	onInit(): void {
		this._booksTalbe = this.byId("booksTable") as Table;
		this._booksDetails = this.byId("bookDetails") as Panel;
	}

	public onBooksSort(event:Icon$PressEvent): void {
		const asc = event.getSource().getSrc() === "sap-icon://sort-ascending"
		const itemsBinding = this._booksTalbe.getBinding("items") as ODataListBinding;
		itemsBinding.sort(new Sorter("title", asc))
		event.getSource().setSrc(asc ? "sap-icon://sort-descending" : "sap-icon://sort-ascending")
	}	

	public onBookSelect(event: ListItemBase$PressEvent): void {
		const listItem = event.getSource();
		this._booksDetails.setVisible(true);
		this._booksDetails.bindElement(listItem.getBindingContext().getPath());
	}

	public async onBookOrder(event: Button$PressEvent): Promise<void> {
		const oAction = this.getModel().bindContext("/submitOrder(...)") as ODataContextBinding;
		oAction.setParameter("book", event.getSource().getBindingContext().getProperty("ID"));
		oAction.setParameter("quantity", 1);
		try {
			await oAction.invoke();
			this.getModel().refresh();
		} catch (err) {
			MessageBox.error("Failed to order the book.\nReason: " + (err as Error).message);
		}
	}


}
