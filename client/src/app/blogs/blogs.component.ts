import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { CommonModule } from '@angular/common';

interface Blog {
  _id: string;
  image: {
    url: string;
    altText: string;
  };
  title: string;
  content: string;
}

@Component({
  selector: 'app-blogs',
  imports:[CommonModule],
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {
  blogs: Blog[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogService.getBlogs().subscribe({
      next: (res: Blog[]) => {
        this.blogs = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load blogs';
        console.error(err);
        this.loading = false;
      }
    });
  }
}