import {Component , OnInit,Input} from '@angular/core';
import {Router, ActivatedRoute,Params} from '@angular/router';
import {Publication} from'../../models/publication';
import {GLOBAL} from '../../services/global'
import {UserService} from '../../services/user.service'
import {PublicationService} from '../../services/publication.service';



@Component({
	selector: 'publications',
	templateUrl:'./publications.component.html',
	providers: [UserService,PublicationService]
})
export class PublicationsComponent implements OnInit {

    public identity;
    public token;
    public title:string;
    public url:string;
    public status : string;
    public page;
    public total;
    public pages;
    public itemsPerPage;
    public publications: Publication[];
    public showImage;
    @Input() user:string;
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService:UserService,
        private _publicationService:PublicationService

    ){
        this.title='Publicaciones';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.page=1;
    }

    ngOnInit(){
        console.log('Publications component cargado correctamente');
        this.getPublications(this.user,this.page);

    }
    getPublications(user,page,adding=false){
        this._publicationService.getPublicationUser(this.token,user,page).subscribe(response=>{
            if (response.publications) {
                this.total=response.total_items;
                this.pages = response.pages;
                this.itemsPerPage = response.items_per_page;
                if (!adding) {
                    this.publications=response.publications
                }
                else{
                    var arrayA = this.publications;
                    var arrayB = response.publications;
                    this.publications = arrayA.concat(arrayB);

                    $("html,body").animate({scrollTop:$('html').prop("scrollHeight")},500);

                }



                if (page>this.pages) {
                    //this._router.navigate(['/home']);
                }

            }
            else{
                this.status="error";
            }


        },
        error=>{
            var errorMessage=<any>error;
            console.log(errorMessage);
            if (errorMessage!=null) {
                this.status = 'error';
            }

        });
        console.log('Hola')
    }
    public noMore=false;
    viewMore(){
         this.page +=1;
        if (this.page == this.pages) {
            this.noMore = true;
        }
      
        this.getPublications(this.user,this.page,true);
    }
        showThisImage(id){
        this.showImage=id;
    }
    hideThisImage(id)
    {
        this.showImage=0;
    }
        refresh(event = null){
        this.getPublications(this.user,1,true);

    }

     deletePublication(id)
    {
        this._publicationService.deletePublication(this.token,id).subscribe(
            response =>{
                this.refresh();
                
            },
            error=>{
               console.log(<any>error);
            
            }
            );
    }

}