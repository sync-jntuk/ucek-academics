import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../services/backend/backend.service';
import { Form } from '@angular/forms';
import { UploadService } from '../services/upload/upload.service';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

	constructor(private router: Router, private bk: BackendService, private upload: UploadService) { }

	user_data: any = null
	loading: boolean = false

	class_name: String = ''
	changeClass() {
		if (this.class_name == '') {
			this.class_name = 'toggle-sidebar'
		} else {
			this.class_name = ''
		}
	}

	ngOnInit(): void {
		this.user_data = localStorage.getItem("user_data")
		if (!this.user_data) {
			this.router.navigateByUrl('/login')
		}
		this.user_data = JSON.parse(this.user_data)
	}

	updateProfile(params: any) {
		if (params.name) {
			let name: [string] = params.name.split(' ')
			params.first_name = name.join(' ')
			params.last_name = name[name.length - 1]
			name.pop()
		}
		params.roll = this.user_data.roll
		console.log(params)
		this.bk.post('/student/updateprofile', params).subscribe(data => {
			localStorage.setItem("user_data", JSON.stringify(data._doc))
			this.user_data = data._doc
			console.log(data._doc)
		})
	}

	updatePasswd(params: any) {
		params.roll = this.user_data.roll
		console.log(params)
		if (params.length < 8) {
			alert('Password length must be at least 8 characters')
			return
		}
		if (params.npasswd != params.cnpasswd) {
			alert('Password does not match')
			return
		}
		this.bk.post('/student/updatepasswd', params).subscribe(data => {
			if (data.errno != undefined) {
				alert('something went wrong')
			} else {
				alert('password changed successfully')
				location.reload()
			}
		})
	}

	uploadFile() {
		this.loading = true
		this.bk.upload('/upload/profile-picture', this.formData).subscribe((event: any) => {
			if (event.body) {
				this.user_data.picture = event.body.path
				localStorage.setItem('user_data', JSON.stringify(this.user_data))
				console.log(event.body)
				this.loading = false
			}
		});
	}

	formData: FormData = new FormData()
	handleFileInput(event: any) {
		const fileToUpload = event.target.files.item(0)
		this.formData.append('file_to_upload', fileToUpload)
		this.formData.append('roll', localStorage.getItem('roll') || '')
	}

}
