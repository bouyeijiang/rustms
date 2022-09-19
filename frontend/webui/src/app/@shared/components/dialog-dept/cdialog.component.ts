import { Component, Input, OnInit } from '@angular/core';
import { FormLayout, ToastService } from 'ng-devui';
import { ListPager } from 'src/app/@core/services/iservice';
import { SysDeptService } from 'src/app/@core/services/sysdept.service';

@Component({
    selector: 'dialog-dept',
    templateUrl: './cdialog.component.html',
    styleUrls: ['./cdialog.component.scss']
})
export class DialogDeptComponent implements OnInit{
    @Input() data: any;
    @Input() handler: Function;
    layoutDirection: FormLayout = FormLayout.Vertical;
    deptoptions = [
        //{ id: '20404794-657e-433a-a635-db76498edbd6', label: '总部' }
    ];
    min=0;
    max=65535;
     
    formData = {
        id:'',
        dept:'',
        dindex:0,
        parentvalue:{}
    };

    page:ListPager={
        pageIndex:0,
        pageSize:128
    }

    constructor(private service:SysDeptService,
        private toastService:ToastService){
    }

    ngOnInit(): void {
        this.formData.dept=this.data.dept;
        this.formData.id=this.data.id;
        this.formData.dindex=this.data.dindex;

        if(this.data.depts && this.data.depts.length>0){
            let isDefault=false;
            this.data.depts.forEach(el => {
                let item={label:el.dept,id:el.id};
                this.deptoptions.push(item);

                if(this.data.parentid && this.data.parentid.length>0){
                    if (this.data.parentid===item.id){
                        this.formData.parentvalue=item;
                        isDefault=true;
                    }
                }
            });

            if(isDefault==false && this.deptoptions.length>0){
                this.formData.parentvalue=this.deptoptions[0];
            }
        }else{
            this.getDepts();
        }
        // if(this.data.parentid && this.data.parentid.length>0){

        //     for(let i=0;i<this.deptoptions.length;++i){
        //         if (this.data.parentid===this.deptoptions[i].id){
        //             this.formData.parentvalue=this.deptoptions[i];
        //             break;
        //         }
        //     }
        // }
    }

    showToast(type, msg) {
        const results = this.toastService.open({
            value: [{ severity: type, summary: '提示', content: msg }],
        });
    }

    getDepts(){
        this.service.getSources(this.page,{dept:''},(res)=>{
            if(res.code===200){
                let isDefault=false;
                res.value.forEach(el => {
                    let item={label:el.dept,id:el.id};
                    this.deptoptions.push(item);

                    if(this.data.parentid && this.data.parentid.length>0){
                        if (this.data.parentid===item.id){
                            this.formData.parentvalue=item;
                            isDefault=true;
                        }
                    }
                });

                if(isDefault==false && this.deptoptions.length>0){
                    this.formData.parentvalue=this.deptoptions[0];
                }
            }else{
                this.showToast('warning',res.value);
            }
        });
    }

    close($event) {
        this.handler($event);
    }
}