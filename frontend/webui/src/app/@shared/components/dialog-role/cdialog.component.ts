import { Component, Input, OnInit } from '@angular/core';
import { DialogService, FormLayout, ToastService } from 'ng-devui';
import { ListPager } from 'src/app/@core/services/iservice';
import { SysRoleService } from 'src/app/@core/services/sysrole.service';
import { DialogRoleDRightComponent } from './dialog-role-dright/cdialog.component';
import { DialogRoleMRightComponent } from './dialog-role-mright/cdialog.component';

@Component({
    selector: 'dialog-role',
    templateUrl: './cdialog.component.html',
    styleUrls: ['./cdialog.component.scss']
})
export class DialogRoleComponent implements OnInit{
    @Input() data: any;
    @Input() handler: Function;
    layoutDirection: FormLayout = FormLayout.Vertical;
    roleoptions = [
         { id: 0, label: '菜单权限' },
         { id: 1, label: '数据权限' }
    ];
 
    formData = {
        act:'',
        id:'',
        role_name:'',
        detail:'',
        roletypevalue:this.roleoptions[0],
        tmpRight:[]
    };

    page:ListPager={
        pageIndex:0,
        pageSize:128
    }

    constructor(private service:SysRoleService,
        private toastService:ToastService,
        private dialogService:DialogService){
    }

    ngOnInit(): void {
        this.formData.act=this.data.act;
        this.formData.role_name=this.data.role_name;
        this.formData.detail=this.data.detail;
        this.formData.id=this.data.id;

        if(this.data.role_type===0){
            this.formData.roletypevalue=this.roleoptions[0];
        }else{
            this.formData.roletypevalue=this.roleoptions[1];
        }
    
        if(this.formData.act==='edit' && this.formData.id.length>0){

            this.service.getRight(this.formData.id,(res)=>{
                if(res.code===200){
                    this.formData.tmpRight=res.value;

                    let _detail=[];
                    this.formData.tmpRight.forEach((el)=>{
                        _detail.push({id:el.relate_id,value:el.right_value});
                    });
                    this.formData.detail=JSON.stringify(_detail);
                }else{
                    this.showToast('error',res.value);
                }
            });
        }
    }

    showToast(type, msg) {
        const results = this.toastService.open({
            value: [{ severity: type, summary: '提示', content: msg }],
        });
    }

    configDialog(act,type){
        let isMenuRight=this.formData.roletypevalue.id===0;

        const results = this.dialogService.open({
            id: 'add-dialog-role-menu_data',
            width: '800px',
            maxHeight: '494px',
            title:isMenuRight? '菜单权限配置':'数据权限配置',
            content:isMenuRight? DialogRoleMRightComponent:DialogRoleDRightComponent,
            backdropCloseable: true,
            data: {
                act:this.formData.act,
                detail:act==="edit"?'':'',
                right:this.formData.tmpRight,
                canConfirm:(val:boolean)=>{
                     results.modalInstance.updateButtonOptions([{disabled:!val}]);
                }
            },
            dialogtype: type,
            showAnimation: true,
            buttons: [
                {
                    cssClass: 'primary',
                    text: '确定',
                    disabled:true,
                    handler: ($event: Event) => {
                        var form = results.modalContentInstance.formData;
                        this.formData.detail=JSON.stringify(form.selected);
                        results.modalInstance.hide();
                        this.onChanged();
                    },
                },
                {
                    id: 'btn-grant-cancel',
                    cssClass: 'common',
                    text: '取消',
                    handler: ($event: Event) => {
                        results.modalInstance.hide();
                    },
                },
            ]
        });
    }

    close($event) {
        this.handler($event);
    }

    roleChanged(){
        this.formData.detail='';
    }

    onChanged(){
        if(this.formData.role_name.length>0 && this.formData.detail.length>0){
            this.data.canConfirm(true);
          }else{
            this.data.canConfirm(false);
          }
    }
}