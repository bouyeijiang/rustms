import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit
} from '@angular/core';
import { SysUser } from 'src/app/@core/data/sysuser';
import { SysRoleService } from 'src/app/@core/services/sysrole.service';
import { ListPager } from 'src/app/@core/services/iservice';
import { DialogService, LoadingService, LoadingType, TableWidthConfig, ToastService } from 'ng-devui';
import { Observable, Subscription } from 'rxjs';
import { SysRole } from 'src/app/@core/data/sysrole';
import { DialogRoleComponent } from 'src/app/@shared/components/dialog-role/cdialog.component';
import { DialogRoleDetailComponent } from 'src/app/@shared/components/dialog-role/dialog-role-detail/cdialog.component';
@Component({
    selector: 'list-app-sysrole-role',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./role.component.scss'],
    templateUrl: './role.component.html'
})
export class RoleComponent implements OnInit {
    tableWidthConfig: TableWidthConfig[] =
        [
            {
                field: 'role_name',
                width: '120px'
            },
            {
                field: 'role_type',
                width: '100px'
            },
            {
                field: 'op',
                width: '160px'
            }
        ];

    dataTableHeader = {
        columns: [
            {
                field: 'role_name',
                header: '角色名称',
                fieldType: 'text',
            },
            {
                field: 'role_type',
                header: '角色类型',
                fieldType: 'number',
            },{
                field: 'op',
                header: '操作',
                fixedRight:'0px'
            }
        ]
    };
    showLoading=false;
    loading: LoadingType;
    busy: Subscription;
    waittingRt: any;
    
    pager: ListPager = {
        pageIndex: 0,
        pageSize: 8,
        total:0
    }
    formData={
        role_name:''
    };
    dataSource: Array<SysUser> = [];


    constructor(private sysRoleService: SysRoleService,
        private toastService:ToastService,
        private loadingService:LoadingService,
        private changeDetectorRef: ChangeDetectorRef,
        private dialogService:DialogService) {

            this.loading = new Observable((function (observer) {
                if (this.complete) {
                    observer.onNext(this.complete);
                    observer.onCompleted();
                }
            }).bind(this));

            this.onQuery();
    }
    ngOnInit() {
    }

    showToast(type, msg) {
        const results = this.toastService.open({
            value: [{ severity: type, summary: '提示', content: msg }],
        });
    }

    onQuery(){
        if(this.showLoading)return;

        this.showLoading=true;
        this.waittingRt = this.loadingService.open();

        this.sysRoleService.getSources(this.pager,{role_name:this.formData.role_name},res=> {
            this.waittingRt.loadingInstance.close();
            this.showLoading=false;

            if(res.code===200){
                this.dataSource = res.value;
                this.pager.total=res.total;
                this.changeDetectorRef.markForCheck();
            }
            else{
                console.log(res);
                this.showToast('error',
                (res.message===undefined || res.message.length===0)?res.value:res.message);
            }
        });
    }

    onAddOrUpdate(row:any,act){
        const results = this.dialogService.open({
            id: 'add-dialog-role',
            width: '500px',
            maxHeight: '309px',
            title: act==="edit"?'修改角色信息':'添加角色信息',
            content: DialogRoleComponent,
            backdropCloseable: true,
            data: {
                act:act,
                id:act==="edit"?row.id:'',
                role_name:act==="edit"?row.role_name:'',
                role_type:act==="edit"?row.role_type:0,
                detail:'',
                canConfirm:(val:boolean)=>{
                    results.modalInstance.updateButtonOptions([{disabled:!val}]);
               }
            },
            dialogtype: 'standard',
            showAnimation: true,
            buttons: [
                {
                    cssClass: 'primary',
                    text: '确定',
                    disabled:true,
                    handler: ($event: Event) => {
                        var form = results.modalContentInstance.formData;
                        results.modalInstance.hide();
                        let item:SysRole={
                            id:act==='add'?'':row.id,
                            role_name:form.role_name,
                            role_type:form.roletypevalue.id,
                            detail:form.detail
                        };

                        if (act==='add'){
                            this.sysRoleService.add(item,(res)=>{
                                    if(res.code===200){
                                        this.showToast('success','添加成功');
                                        this.onQuery();
                                    }else{
                                        this.showToast('error','添加失败');
                                    }
                            });
                        }else{
                            this.sysRoleService.update(item,(res)=>{
                                    if(res.code===200){
                                        this.showToast('success','修改成功');
                                        this.onQuery();
                                    }else{
                                        this.showToast('error','修改失败');
                                    }
                            });
                        }
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
            ],
        });
    }

    addRow(){
     this.onAddOrUpdate(null,"add");
    }
    DetailRow(row:any,index:number){
        const results = this.dialogService.open({
            id: 'add-dialog-detail',
            width: '500px',
            maxHeight: '309px',
            title:'权限详情',
            content: DialogRoleDetailComponent,
            backdropCloseable: true,
            data: {
                 role_id:row.id,
                 role_type:row.role_type
            },
            dialogtype: 'standard',
            showAnimation: true,
            buttons: [
                // {
                //     cssClass: 'primary',
                //     text: '确定',
                //     disabled:true,
                //     handler: ($event: Event) => {
                //        var form = results.modalContentInstance.formData;
                //         results.modalInstance.hide();
                //     },
                // },
                {
                    id: 'btn-grant-cancel',
                    cssClass: 'common',
                    text: '取消',
                    handler: ($event: Event) => {
                        results.modalInstance.hide();
                    },
                },
            ],
        });
    }
    editRow(row: any, index: number) { 
        this.onAddOrUpdate(row,"edit");
    }

    deleteRow(row:any,index: number) {
        const results = this.dialogService.open({
            id: 'delete-warning-dialog',
            width: '400px',
            maxHeight: '600px',
            html: true,
            content: '<div style="color:#8a6d3b;">确定要删除该数据吗?</div>',
            backdropCloseable: true,
            dialogtype: 'warning',
            buttons: [
                {
                    btnwidth: '84px',
                    cssClass: 'primary',
                    text: '确定',
                    autofocus: true,
                    handler: ($event: Event) => {
                        results.modalInstance.hide();
                        this.waittingRt = this.loadingService.open();

                        this.sysRoleService.delete(row,(res)=>{
                                this.waittingRt.loadingInstance.close();
                                if(res.code===200){
                                    this.showToast('success','删除成功');
                                    this.onQuery();
                                }else{
                                    this.showToast('error',res.value);
                                }
                        });
                    },
                },
                {
                    id: 'btn-del-cancel',
                    cssClass: 'common',
                    text: '取消',
                    handler: ($event: Event) => {
                        results.modalInstance.hide();
                    },
                },
            ],
        });
     }

    onPageChange(e: number) {
        this.pager.pageIndex = e;
        this.onQuery();
    }

    onSizeChange(e: number) {
        this.pager.pageSize = e;
        this.onQuery();
    }
}