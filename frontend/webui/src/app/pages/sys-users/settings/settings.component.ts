import {
    ChangeDetectionStrategy,
    Component,
    OnInit
} from '@angular/core';
import { DialogService, FormLayout, ToastService } from 'ng-devui';
import { AuthService } from 'src/app/@core/services/auth.service';
import {hex_sha1} from '@sha1/sha1.js';
import { SysUser } from 'src/app/@core/data/sysuser';
import { SysUserService } from 'src/app/@core/services/sysuser.service';
@Component({
    selector: 'app-users-settings',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./settings.component.scss'],
    templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
    layoutDirection: FormLayout = FormLayout.Vertical;
    sexoptions=[{label:'男',id:0},{label:'女',id:1}];
    utypeoptions=[{label:'用户账户',id:0},{label:'管理账户',id:1}];
    deptoptions=[{label:'总部',id:'20404794-657e-433a-a635-db76498edbd6'},{label:'开发部',id:'a99070b3-d027-4a1a-98dd-d758d782fea5'}];
    dataroleoptions=[{label:'管理员数据权限',id:'16af2021-463b-4b43-a25f-da144d8b2874'}];
    menuroleoptions=[{label:'管理员菜单权限',id:'01f1feaf-13df-46bd-bae7-9eff03cce8e4'}];

    formData={
        id:'',
        uname:'',
        phone:'',
        realname:'',
        status:0,
        upwd:'',
        utype:this.utypeoptions[0],
        dept:this.deptoptions[0],
        datarole:this.dataroleoptions[0],
        menurole:this.menuroleoptions[0],
        sex:this.sexoptions[0],
    };


    constructor(private authService: AuthService,
        private toastService:ToastService,
        private dialogService:DialogService,
        private sysuserService:SysUserService) {
         
    }
    showToast(type, msg) {
        const results = this.toastService.open({
            value: [{ severity: type, summary: '提示', content: msg }],
        });
    }

    onSave(){
        console.log(this.formData);

        if(this.formData.id===''){
            this.showToast('warning','获取用户信息失败,请重新登录');
            return;
        } else if(this.formData.uname===''){
            this.showToast('warning','请输入用户名');
            return;
        } else if(this.formData.phone===''){
            this.showToast('warning','请输入手机号');
            return;
        }
        else if(this.formData.upwd.length<6){
            this.showToast('warning','密码长度不能少于6位');
            return;
        }
        
        const results = this.dialogService.open({
            id: 'delete-warning-dialog',
            width: '400px',
            maxHeight: '600px',
            html: true,
            content: '<div style="color:#8a6d3b;">确定要修改信息吗?</div>',
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
                        let sha1_pwd=hex_sha1(this.formData.upwd).toUpperCase();
                        let item:SysUser={
                            id:this.formData.id,
                            uname:this.formData.uname,
                            phone:this.formData.phone,
                            realname:this.formData.realname,
                            status:0,
                            upwd:sha1_pwd,
                            sex:this.formData.sex.label,
                            utype:this.formData.utype.id,
                            dept_id:this.formData.dept.id,
                            menu_role_id:this.formData.menurole.id,
                            data_role_id:this.formData.datarole.id
                        };
                        this.sysuserService.update(item,(res)=>{
                            if(res.code===200){
                                this.showToast('success','修改成功');
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

    ngOnInit() {
        let info= this.authService.getSession();
        if(info!=null){
            this.formData.id=info.id;
            this.formData.uname=info.uname;
            this.formData.phone=info.phone;
            this.formData.realname=info.realname;
        }
    }
}