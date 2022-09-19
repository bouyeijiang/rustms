
import { Component, Input, OnInit } from '@angular/core';
import { FormLayout, ToastService } from 'ng-devui';
import { ListPager } from 'src/app/@core/services/iservice';
import { SysDeptService } from 'src/app/@core/services/sysdept.service';
import { SysRoleService } from 'src/app/@core/services/sysrole.service';

@Component({
    selector: 'dialog-user',
    templateUrl: './cdialog.component.html',
    styleUrls: ['./cdialog.component.scss']
})
export class DialogUserComponent implements OnInit{
    @Input() data: any;
    @Input() handler: Function;
    layoutDirection: FormLayout = FormLayout.Vertical;

    sexoptions=[{label:'男',id:0},{label:'女',id:1}];
    utypeoptions=[{label:'用户账户',id:0},{label:'管理账户',id:1}];
    deptoptions=[];//[{label:'总部',id:'20404794-657e-433a-a635-db76498edbd6'},{label:'开发部',id:'a99070b3-d027-4a1a-98dd-d758d782fea5'}];
    dataroleoptions=[];//[{label:'管理员数据权限',id:'16af2021-463b-4b43-a25f-da144d8b2874'}];
    menuroleoptions=[];//[{label:'管理员菜单权限',id:'01f1feaf-13df-46bd-bae7-9eff03cce8e4'}];

    constructor(private roleService:SysRoleService,
        private deptService:SysDeptService,
        private toastService:ToastService){

            this.getDepts();
            this.getRoles();

    }

    formData = {
        id:'',
        account:'',
        phone:'',
        pwd:'',
        realname:'',
        utype:this.utypeoptions[0],
        dept:this.deptoptions[0],
        datarole:this.dataroleoptions[0],
        menurole:this.menuroleoptions[0],
        sex:this.sexoptions[0],
        status:true
    };
    ngOnInit(): void {
        this.formData.account=this.data.account;
        this.formData.phone=this.data.phone;
        this.formData.realname=this.data.realname;
        this.formData.pwd=this.data.pwd;
        this.formData.id=this.data.id;

        if(this.data.status===1){
            this.formData.status=false;
        }else{
            this.formData.status=true;
        }

        if(this.data.sex==='女'){
            this.formData.sex=this.sexoptions[0];
        }else{
            this.formData.sex=this.sexoptions[1];
        }
        if(this.data.utype===0){
            this.formData.utype=this.utypeoptions[0];
        }else{
            this.formData.utype=this.utypeoptions[1];
        }

        for(let i=0;i<this.deptoptions.length;++i){
            if(this.data.dept_id===this.deptoptions[i].id){
                this.formData.dept=this.deptoptions[i];
                break;
            }
        }
        for(let i=0;i<this.dataroleoptions.length;++i){
            if(this.data.data_role_id===this.dataroleoptions[i].id){
                this.formData.datarole=this.dataroleoptions[i];
                break;
            }
        }
        for(let i=0;i<this.menuroleoptions.length;++i){
            if(this.data.menu_role_id===this.menuroleoptions[i].id){
                this.formData.menurole=this.menuroleoptions[i];
                break;
            }
        }
    }
    showToast(type, msg) {
        this.toastService.open({
            value: [{ severity: type, summary: '提示', content: msg }],
        });
    }

    page:ListPager={
        pageIndex:0,
        pageSize:256
    };

    getRoles(){
        this.roleService.getSources(this.page,{ role_name:'' },(res)=>{
            if(res.code===200){
                res.value.forEach(el => {
                    if(el.role_type===0){
                        this.menuroleoptions.push({label:el.role_name,id:el.id});
                    }else{
                        this.dataroleoptions.push({label:el.role_name,id:el.id});
                    }
                });

                if(this.menuroleoptions.length>0 && this.formData.menurole===undefined){
                    this.formData.menurole=this.menuroleoptions[0];
                } 
                 if(this.dataroleoptions.length>0 && this.formData.datarole===undefined){
                    this.formData.datarole=this.dataroleoptions[0];
                }

            }else{
                this.showToast('error',res.value);
            }
        });
    }

    getDepts(){
        this.deptService.getSources(this.page,{dept:''},(res)=>{
            if(res.code===200){
                res.value.forEach(el => {
                    this.deptoptions.push({label:el.dept,id:el.id});
                });

                if(this.deptoptions.length>0 && this.formData.dept===undefined){
                    this.formData.dept=this.deptoptions[0];
                }

            }else{
                this.showToast('error',res.value);
            }
        });
    }

    close($event) {
        this.handler($event);
    }
}