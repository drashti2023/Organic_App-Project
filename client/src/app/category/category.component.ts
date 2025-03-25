import { Component, inject } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-category',
  imports: [NgFor],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {
  selectedCategory: any = null
      private _api = inject(ApiService)
      private _router = inject(Router)
       
      category:any[]=[]
      
      ngOnInit(){
        this._api.getAll().subscribe((res: any) => {
          this.category=res;
          console.log(this.category); // Log the response to check image URLs
        })
      }

      viewCategory(categoryId: string) {
        console.log("Navigating to category:", categoryId);
        this._router.navigate(['/products', categoryId]);
      }

      

}
