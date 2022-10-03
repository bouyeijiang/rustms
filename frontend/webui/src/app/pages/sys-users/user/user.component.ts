import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit
} from '@angular/core';
import { SysUser } from 'src/app/@core/data/sysuser';
import { SysUserService } from 'src/app/@core/services/sysuser.service';
import { ListPager } from 'src/app/@core/services/iservice';
import { DialogService, LoadingService, LoadingType, TableWidthConfig, ToastService } from 'ng-devui';
import { DialogUserComponent } from 'src/app/@shared/components/dialog-user/cdialog.component';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/@core/services/auth.service';
import { Router } from '@angular/router';
import {hex_sha1} from '@sha1/sha1.js';
@Component({
    selector: 'list-app-users-user',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./user.component.scss'],
    templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
    tableWidthConfig: TableWidthConfig[] =
        [
            {
                field: 'uname',
                width: '120px'
            },
            {
                field: 'phone',
                width: '120px'
            },
            {
                field: 'realname',
                width: '120px'
            },
            {
                field: 'sex',
                width: '80px'
            },
            {
                field: 'utype',
                width: '80px'
            },
            {
                field: 'dept',
                width: '120px'
            },
            {
                field: 'status',
                width: '100px'
            },
            {
                field: 'op',
                width: '140px'
            }
        ];

    dataTableHeader = {
        columns: [
            {
                field: 'uname',
                header: '登录账户',
                fieldType: 'text',
                sortable: true,
            },
            {
                field: 'phone',
                header: '手机号码',
                fieldType: 'text',
                sortable: true,
            },
            {
                field: 'realname',
                header: '姓名',
                fieldType: 'text',
                sortable: true,
            },
            {
                field: 'sex',
                header: '性别',
                fieldType: 'text',
                sortable: true,
            },
            {
                field: 'utype',
                header: '类型',
                fieldType: 'text',
                sortable: true,
            },
            {
                field: 'dept',
                header: '部门',
                fieldType: 'text',
                sortable: true,
            },
            {
                field: 'status',
                header: '状态',
                fieldType: 'number',
                sortable: true,
            },
            {
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
        phone:'',
        uname:''
    };
    dataSource: Array<SysUser> = [];


    constructor(private sysUserService: SysUserService,
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
        this.toastService.open({
            value: [{ severity: type, summary: '提示', content: msg }],
        });
    }

    onQuery(){
        if(this.showLoading)return;

        this.showLoading=true;
        this.waittingRt = this.loadingService.open();

        this.sysUserService.getSources(this.pager,{
            uname:this.formData.uname,
            phone:this.formData.phone
        },res=> {
            this.waittingRt.loadingInstance.close();
            this.showLoading=false;

            if(res.code===200){
                this.dataSource = res.value;
                this.pager.total=res.total;
                this.changeDetectorRef.markForCheck();
            }
            else{
                console.log(res);
                this.showToast('error',res.message);
            }
        });
    }

    onAddOrUpdate(row:any,act){
        const results = this.dialogService.open({
            id: 'add-dialog-user',
            width: '600px',
            maxHeight: '370px',
            title: act==="edit"?'修改用户信息':'添加用户信息',
            content: DialogUserComponent,
            backdropCloseable: true,
            data: {
                id:act==="edit"?row.id:'',
                account:act==="edit"?row.uname:'',
                realname:act==="edit"?row.realname:'',
                status: act==="edit"?row.status:0,
                phone:act==="edit"?row.phone:'',
                deptid:act==="edit"?row.dept_id:'',
                menuroleid:act==="edit"?row.menu_role_id:'',
                dataroleid:act==="edit"?row.data_role_id:'',
                pwd: ''
            },
            dialogtype: 'standard',
            showAnimation: true,
            buttons: [
                {
                    cssClass: 'primary',
                    text: '确定',
                    handler: ($event: Event) => {
                        var form = results.modalContentInstance.formData;
                        if(act==="edit"){
                            if(form.id===''){
                                this.showToast('warning','用户编号获取失败');
                                return;
                            }
                        }
                        if(form.account===''){
                            this.showToast('warning','请输入账户');
                            return;
                        }
                        if(form.pwd.length<6){
                            this.showToast('warning','请输入至少6位密码');
                            return;
                        }

                        let sha1_pwd=hex_sha1(form.pwd).toUpperCase();
                        let item:SysUser={
                            id:form.id,
                            uname:form.account,
                            realname:form.realname,
                            status:form.status===true?0:1,
                            upwd:sha1_pwd,
                            utype:form.utype.id,
                            sex:form.sex.label,
                            phone:form.phone,
                            dept_id:form.dept.id,
                            data_role_id:form.datarole.id,
                            menu_role_id:form.menurole.id
                        };
                        this.waittingRt = this.loadingService.open();
                        if(act==="add"){
                            this.sysUserService.add(item,res=>{
                                results.modalInstance.hide();
                                this.waittingRt.loadingInstance.close();

                                if(res.code===200){
                                    this.showToast('success','添加成功');
                                    this.onQuery();
                                }else{
                                    this.showToast('error',res.value);
                                }
                            });
                        }else{
                            this.sysUserService.update(item,(res)=>{
                                results.modalInstance.hide();
                                this.waittingRt.loadingInstance.close();

                                if(res.code===200){
                                    this.showToast('success','修改成功');
                                    this.onQuery();
                                }else{
                                    this.showToast('error',res.value);
                                }
                            })
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

                        this.sysUserService.delete(row,(res)=>{
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