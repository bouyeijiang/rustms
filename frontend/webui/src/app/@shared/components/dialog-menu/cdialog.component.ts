import { Component, Input, OnInit } from '@angular/core';
import { FormLayout, ToastService } from 'ng-devui';
import { SysMenuService } from 'src/app/@core/services/sysmenu.service';

@Component({
    selector: 'dialog-menu',
    templateUrl: './cdialog.component.html',
    styleUrls: ['./cdialog.component.scss']
})
export class DialogMenuComponent implements OnInit{
    @Input() data: any;
    @Input() handler: Function;
    layoutDirection: FormLayout = FormLayout.Vertical;
    min=0;
    max=65535;
    menu_type_options=[{label:'主菜单',id:0},{label:'子菜单',id:1},{label:'外链接',id:2}];
     
    formData = {
        id:'',
        pid:'',
        menu_name:'',
        menu_uri:'',
        icon:'',
        menutypevalue:this.menu_type_options[0],
        mindex:0
    };

    constructor(private service:SysMenuService,
        private toastService:ToastService){
    }

    ngOnInit(): void {
        this.formData.pid=this.data.pid;
        this.formData.id=this.data.id;
        this.formData.mindex=this.data.mindex;
        this.formData.menu_name=this.data.menu_name;
        this.formData.menu_uri=this.data.menu_uri;
        this.formData.icon=this.data.icon;

        if(this.data.menu_type && this.data.menu_type>0){

            for(let i=0;i<this.menu_type_options.length;++i){
                if (this.data.menu_type===this.menu_type_options[i].id){
                    this.formData.menutypevalue=this.menu_type_options[i];
                    break;
                }
            }
        }
    }

    showToast(type, msg) {
        this.toastService.open({
            value: [{ severity: type, summary: '提示', content: msg }],
        });
    }

    close($event) {
        this.handler($event);
    }
}