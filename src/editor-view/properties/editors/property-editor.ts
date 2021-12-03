import { Editor } from 'core/editor';
import { DataOrigin } from 'data/editor-data';
import { InspectorPropertyModel } from 'data/inspector-data';
import { IdUtil } from 'util/id.util';
import './property-editor.scss';

export abstract class PropertyEditor<T> extends HTMLElement {
	protected prop: InspectorPropertyModel;
	public changedOutsideInspector = false;

	protected _internalValue: T;

	public connectedCallback() { this.classList.add('property-editor'); }

	public setContent(prop: InspectorPropertyModel, value: T, hasCopyButton: boolean, fieldId?: string) {
		fieldId = fieldId ?? `${prop.name}-${IdUtil.genHexId()}`;
		this.prop = prop;
		if (!value) value = this.getDefaultValue();

		const titleCol = this.appendChild(document.createElement('div'));
		titleCol.classList.add('property-title', prop.name);
		titleCol.appendChild(this.createLabel(fieldId, prop));

		this.appendChild(this.createContent(value, fieldId, prop));

		this.setInternalValue(value);
		this.onchange = this.onValueChanged.bind(this);
		if (hasCopyButton) this.createCopyButton();
	}

	protected createLabel(fieldId: string, prop: InspectorPropertyModel): HTMLElement {
		const label = document.createElement('label');
		label.append(prop.label ?? prop.name);
		label.setAttribute('for', fieldId);
		return label;
	}

	protected createContent(value: T, fieldId: string, prop: InspectorPropertyModel) {
		const propContent = document.createElement('div');
		propContent.classList.add('property-content', prop.name);

		const innerContent = this.createInnerContent(fieldId, value, prop);
		propContent.append(innerContent);

		return propContent;
	}

	protected abstract createInnerContent(fieldId: string, value: T, prop: InspectorPropertyModel): HTMLElement;

	protected createCopyButton() {
		const btn = this.appendChild(document.createElement('div'));
		btn.classList.add('copy-button');
		btn.onclick = this.copyToClipboard.bind(this);

		btn.appendChild(document.createElement('i'))
			.classList.add('fas', 'fa-clone');
	}

	protected copyToClipboard() { navigator.clipboard.writeText(`"${this.prop.name}": ${this.valueToJson()}`); }
	protected valueToJson(): string { return JSON.stringify(this.getInternalValue()); }

	public propertyChangedOutsideInspector(value: T) {
		this.changedOutsideInspector = true;
		this.setInternalValue(value);
	}

	protected onValueChanged(e: Event, save = true) {
		if (this.changedOutsideInspector) {
			this.changedOutsideInspector = false;
			return;
		}
		if (save) this.savePreviousValue();
		this.updateInternalValue(e);
		Editor.data.propertyChanged(this.prop.name, this.getInternalValue(), DataOrigin.INSPECTOR);
	}

	public getInternalValue(): T { return this._internalValue; }
	public abstract setInternalValue(value: T): void;
	public abstract updateInternalValue(e: Event): void;

	protected abstract getDefaultValue(): T;

	public savePreviousValue() {
		Editor.history.prepare(Editor.data.selectedObject, {
			[this.prop.name]: this.getInternalValue(),
		}).commit();
	}
}
