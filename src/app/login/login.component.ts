import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../services/backend/backend.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent {
	@ViewChild('roll') roll!: ElementRef

	constructor(private router: Router, private bk: BackendService) { }

	loading = false
	ngOnInit(): void {
	}

	forgotPassword() {
		let roll = this.roll.nativeElement.value
		if (roll?.length != 10) {
			Swal.fire('invalid roll number', 'Please Enter proper roll number', 'warning')
			return
		}
		this.loading = true
		this.bk.post('/student/forgotpasswd', { roll: roll }).subscribe(data => {
			this.loading = false
			if (data.error != undefined) {
				Swal.fire('failed', 'Roll number doesn\'t registered or Internal Error', 'error')
				return
			}
			Swal.fire('Email sent', 'A Recovery password is sent to your email', 'success')
		})
	}

	getUser(userData: Object) {
		this.bk.post('/student/login', userData).subscribe(data => {
			if (data.errno) {
				Swal.fire('autentication failed', 'password wrong or invalid user', 'error')
				return
			}
			localStorage.setItem('roll', data.roll)
			localStorage.setItem('email', data.email)
			localStorage.setItem('username', data.first_name + ' ' + data.last_name)
			localStorage.setItem('regulation', data.regulation)
			localStorage.setItem('batch', data.batch)
			localStorage.setItem('user_data', JSON.stringify(data))
			this.router.navigateByUrl('/home')
		})
	}
}
