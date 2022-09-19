import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit
} from '@angular/core';
import { SysDept } from 'src/app/@core/data/sysdept';
import { SysDeptService } from 'src/app/@core/services/sysdept.service';
import { ListPager } from 'src/app/@core/services/iservice';
import { DialogService, LoadingService, LoadingType, TableWidthConfig, ToastService } from 'ng-devui';
import { DialogDeptComponent } from 'src/app/@shared/components/dialog-dept/cdialog.component';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/@core/services/auth.service';
import { Router } from '@angular/router';
@Component({
    selector: 'list-app-sysdept-dept',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./dept.component.scss'],
    templateUrl: './dept.component.html'
})
export class DeptComponent implements OnInit {
    tableWidthConfig: TableWidthConfig[] =
        [
            {
                field: 'id',
                width: '220px'
            },
            {
                field: 'dept',
                width: '120px'
            },
            {
                field: 'pid',
                width: '220px'
            },
            {
                field: 'dindex',
                width: '80px'
            },
            {
                field: 'op',
                width: '140px'
            }
        ];

    dataTableHeader = {
        columns: [
            {
                field: 'id',
                header: '编号',
                fieldType: 'text',
            },
            {
                field: 'dept',
                header: '名称',
                fieldType: 'text',
            },
            {
                field: 'pid',
                header: '上级编号',
                fieldType: 'text',
            },
            {
                field: 'dindex',
                header: '序号',
                fieldType: 'number',
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
        pageSize: 16,
        total:0
    }
    formData={
        dept:'',
    };
    dataSource: Array<SysDept> = [];


    constructor(private sysDeptService: SysDeptService,
        private toastService:ToastService,
        private loadingService:LoadingService,
        private changeDetectorRef: ChangeDetectorRef,
        private authService:AuthService,
        private route:Router,
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

        this.sysDeptService.getSources(this.pager,{
            dept:this.formData.dept,
        },res=> {
            this.waittingRt.loadingInstance.close();
            this.showLoading=false;

            if(res.code===200){
                this.dataSource = res.value;
                this.pager.total=res.total;
                this.changeDetectorRef.markForCheck();
            }else if(res.code===401 || res.code===403){       
                this.authService.logout();
                this.route.navigate(['/', 'login']);
            }
            else{
                console.log(res);
                this.showToast('error',res.message);
            }
        });
    }

    onAddOrUpdate(row:any,act){
        const results = this.dialogService.open({
            id: 'add-dialog-dept',
            width: '400px',
            maxHeight: '247px',
            title: act==="edit"?'修改部门信息':'添加部门信息',
            content: DialogDeptComponent,
            backdropCloseable: true,
            data: {
                id:act==="edit"?row.id:'',
                dept:act==="edit"?row.dept:'',
                pid:act==="edit"?row.pid:'',
                dindex:act==="edit"?row.dindex:0,
                depts:this.dataSource
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
                                this.showToast('warning','部门编号获取失败');
                                return;
                            }
                        }
                        if(form.dept===''){
                            this.showToast('warning','请输入部门名称');
                            return;
                        }
      
                        let item:SysDept={
                            id:form.id,
                            dept:form.dept,
                            pid:form.parentvalue.id,
                            dindex:form.dindex
                        };
                        this.waittingRt = this.loadingService.open();
                        if(act==="add"){
                            this.sysDeptService.add(item,res=>{
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
                            this.sysDeptService.update(item,(res)=>{
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
        console.log(row);
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

                        this.sysDeptService.delete(row,(res)=>{
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