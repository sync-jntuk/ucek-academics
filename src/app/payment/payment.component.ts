import { Component } from '@angular/core';

@Component({
	selector: 'app-payment',
	templateUrl: './payment.component.html',
	styleUrls: ['./payment.component.css']
})
export class PaymentComponent {

	constructor() {}

	class_name: String = ''
	changeClass() {
		if (this.class_name == '') {
			this.class_name = 'toggle-sidebar'
		} else {
			this.class_name = ''
		}
	}

	money: number = 0
	purpose: string = ''

	ngOnInit(): void {
	}

	pay_amount: any = {
		exam_fee: 770,
		bonafide: 100,
		custodian: 100,
		course_completion_certificate: 100
	}

	confirmPayment(formData: any) {
		formData.purpose = this.purpose
		formData.amount = this.pay_amount[this.purpose]
		const keys = ["roll", "name", "email", "purpose", "amount"]
		let link = 'http://127.0.0.1:3000/payment'
		for (const key of keys) {
			if (formData[key] === "") {
                alert("Please fill all fields")
                return
            }
			link += '/' + formData[key]
		}
		location.href = link
	}

	setMoney() {
		this.money = this.pay_amount[this.purpose]
	}

}
