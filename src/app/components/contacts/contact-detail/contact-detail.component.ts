import { Component, Input } from '@angular/core';
import { ContactsComponent } from '../contacts.component';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.scss',
})
export class ContactDetailComponent {
  paramsId = '';

  constructor(public userService: UserService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.routeUserId();
  }

  routeUserId() {
    if (this.route.params.subscribe()) {
      this.route.params.subscribe((params) => {
        this.paramsId = params['id'];
      });
    }
  }
}
