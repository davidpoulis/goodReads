import { Component, OnInit ,Inject} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {book} from '../shared/book'
import {BookService} from '../services/book.service'
import {AuthorService} from '../services/author.service'
import {CategoryService} from '../services/category.service'
import {AuthService} from '../services/auth.service'
import {author} from '../shared/author'
import {category} from '../shared/category'
@Component({
  selector: 'app-admin-books',
  templateUrl: './admin-books.component.html',
  styleUrls: ['./admin-books.component.css']
})
export class AdminBooksComponent implements OnInit {
  books:book[]
  err:string
  username:string
 
 constructor(public dialog: MatDialog,private catService:BookService,
  private authService:AuthService,
  @Inject('BaseURL') private BaseURL) { }
  logout(){
    if(this.authService.isLoggedIn()){
      this.authService.logOut()
    }
    /**
     * 
     *  if(this.authService.isLoggedIn()) {
    this.authService.getUsername().subscribe((name)=>{
      this.username=name;
    })
  }
     */
    
  }

 ngOnInit() {
  if(this.authService.isLoggedIn()) {
    this.authService.getUsername().subscribe((name)=>{
      this.username=name;
    })
  }
 
   this.catService.getBooks().subscribe((cats)=>{
     console.log("books",cats)
    this.books=cats;
   },(err)=>this.err=err)
   }
   //add
 openDialog(): void {
   const dialogRef = this.dialog.open(DialogAddBook, {
     width: '250px'
   });

   dialogRef.afterClosed().subscribe(result => {
    if(result){
     this.catService.createBooks(result).subscribe(cat=>{
       console.log("author",cat)

       this.books=cat
     },err=> this.err=err);
    } 
     
   });
 }
 updateDialog(id:number): void {
   const dialogRef = this.dialog.open(DialogUpdateBook, {
     width: '250px'
   });

   dialogRef.afterClosed().subscribe(result => {
     if(result){
       this.catService.updateBook(result,id).subscribe(cat=>{
         console.log("author",cat)

         this.books=cat
       },err=> this.err=err);
     }
    
     
   });
 }

    delete(id:number){
     this.catService.deleteBook(id).subscribe((doc)=>{
       this.books=doc
     },err=>this.err=err);
   
    }

}
//add 
@Component({
  selector: 'dialog-add-book',
  templateUrl: './dialog-add-book.html',
})
export class DialogAddBook {
  /**
   *    name: String,
    cover: String,
    description: String,
    author_id: { type: mongoose.Schema.Types.ObjectId , ref: 'author'},
    category_id
   */
  book={name:'',cover:'',description:'',author_id:'',category_id:''}
  err:string
  authors:author[]
  category:category[]
  constructor(
    public dialogRef: MatDialogRef<DialogAddBook>,private authorService:AuthorService,
    private categoryService:CategoryService ) {}
    /**
     *  this.authorService.getAuthors().subscribe((authors)=>{
    this.authors=authors
  },err=> console.log(err))
  this.categoryService.getCategories().subscribe((cats)=>{
    this.category=cats
  },err=>console.log(err));
     */
    ngOnInit() {
      this.authorService.getAuthors().subscribe((authors)=>{
        this.authors=authors
      },err=> console.log(err))
      this.categoryService.getCategories().subscribe((cats)=>{
        this.category=cats
      },err=>console.log(err));

    }

  onNoClick(): void {
    this.dialogRef.close();
  }
   
 onSubmit() {
    this.dialogRef.close(this.book);
}
}

//update 
@Component({
  selector: 'dialog-update-book',
  templateUrl: './dialog-update-book.html',
})
export class DialogUpdateBook {
  book={name:'',cover:'',description:'',author_id:'',category_id:''}
  err:string
  constructor(
    public dialogRef: MatDialogRef<DialogUpdateBook> ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
   
 onUpdate() {
  this.dialogRef.close(this.book);
}
}

