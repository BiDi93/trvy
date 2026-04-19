<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SampleFreelancerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $freelancers = [
            [
                'user'    => ['name'=>'Ahmad Rizal','email'=>'ahmad.rizal@test.com','location'=>'Kuala Lumpur','rate'=>80,'bio'=>'Expert plumber with 10 years experience. Specialise in pipe repairs, bathroom fitting and water heater installation.','rating'=>4.8,'jobs'=>42],
                'services'=> [
                    ['title'=>'Pipe Repair & Leak Fixing','desc'=>'Fast and reliable pipe repair service. Available 7 days a week including emergency calls.','price'=>80,'type'=>'per_hour','cat'=>'plumbing','img'=>'images_services/pipe_leaking_repair.png'],
                    ['title'=>'Bathroom Renovation & Fitting','desc'=>'Full bathroom renovation including tiles, sanitary ware, and plumbing works.','price'=>500,'type'=>'fixed','cat'=>'plumbing','img'=>'images_services/pipe_leaking_repair.png'],
                ],
            ],
            [
                'user'    => ['name'=>'Lee Chong Wei','email'=>'lee.cw@test.com','location'=>'Petaling Jaya','rate'=>100,'bio'=>'Certified electrician with 8 years in residential and commercial electrical works.','rating'=>4.9,'jobs'=>67],
                'services'=> [
                    ['title'=>'Electrical Wiring & Installation','desc'=>'Full house wiring, DB box installation, power points and lighting installation.','price'=>100,'type'=>'per_hour','cat'=>'electrical','img'=>'images_services/emergency_electrical_repair.png'],
                    ['title'=>'Emergency Electrical Repair','desc'=>'24/7 emergency electrical repair service. Safety certified.','price'=>150,'type'=>'per_hour','cat'=>'electrical','img'=>'images_services/emergency_electrical_repair.png'],
                ],
            ],
            [
                'user'    => ['name'=>'Farid Azmi','email'=>'farid.azmi@test.com','location'=>'Shah Alam','rate'=>70,'bio'=>'Air-conditioning specialist. Installation, service and repair for all brands.','rating'=>4.6,'jobs'=>31],
                'services'=> [
                    ['title'=>'Aircon Service & Cleaning','desc'=>'Full aircon service including chemical wash, gas top-up and filter cleaning.','price'=>80,'type'=>'fixed','cat'=>'air-cond','img'=>'images_services/aircon_service_cleaning.png'],
                    ['title'=>'Aircon Installation','desc'=>'Supply and install for all brands. 1-year workmanship warranty.','price'=>350,'type'=>'fixed','cat'=>'air-cond','img'=>'images_services/aircon_installation.png'],
                ],
            ],
            [
                'user'    => ['name'=>'Rajan Kumar','email'=>'rajan.k@test.com','location'=>'Subang Jaya','rate'=>120,'bio'=>'IT professional specialising in PC repair, network setup and CCTV installation.','rating'=>4.7,'jobs'=>55],
                'services'=> [
                    ['title'=>'PC & Laptop Repair','desc'=>'Hardware and software repair for all brands. Data recovery service available.','price'=>80,'type'=>'fixed','cat'=>'it-support','img'=>'images_services/pc_laptop_repair.png'],
                    ['title'=>'Network & WiFi Setup','desc'=>'Home and office network setup, router configuration and troubleshooting.','price'=>120,'type'=>'fixed','cat'=>'it-support','img'=>'images_services/network_wifi_setup.png'],
                ],
            ],
            [
                'user'    => ['name'=>'Hafizuddin Noor','email'=>'hafiz.n@test.com','location'=>'Cyberjaya','rate'=>200,'bio'=>'Solar panel expert. Supply, installation and maintenance for residential and commercial.','rating'=>4.5,'jobs'=>18],
                'services'=> [
                    ['title'=>'Solar Panel Installation','desc'=>'End-to-end solar installation with SEDA approval assistance. TNB net metering setup.','price'=>8000,'type'=>'fixed','cat'=>'solar','img'=>'images_services/solar_panel_installation.png'],
                ],
            ],
            [
                'user'    => ['name'=>'Salmah Binti Daud','email'=>'salmah.d@test.com','location'=>'Ampang','rate'=>50,'bio'=>'Professional cleaner with 5 years experience. Residential and office cleaning.','rating'=>4.4,'jobs'=>88],
                'services'=> [
                    ['title'=>'House Deep Cleaning','desc'=>'Full house deep cleaning service including kitchen, bathrooms and all rooms.','price'=>250,'type'=>'fixed','cat'=>'cleaning','img'=>'images_services/house_deep_cleaning.png'],
                    ['title'=>'Regular House Cleaning','desc'=>'Weekly or monthly regular cleaning package. Bring own equipment.','price'=>50,'type'=>'per_hour','cat'=>'cleaning','img'=>'images_services/house_deep_cleaning.png'],
                ],
            ],
        ];

        foreach ($freelancers as $data) {
            $u = $data['user'];

            $user = \App\Models\User::firstOrCreate(
                ['email' => $u['email']],
                [
                    'name'      => $u['name'],
                    'password'  => bcrypt('password'),
                    'role'      => 'freelancer',
                    'kyc_status'=> 'approved',
                    'is_active' => true,
                ]
            );
            $user->assignRole('freelancer');

            \App\Models\FreelancerProfile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'bio'         => $u['bio'],
                    'location'    => $u['location'],
                    'hourly_rate' => $u['rate'],
                    'availability'=> true,
                    'rating_avg'  => $u['rating'],
                    'total_jobs'  => $u['jobs'],
                ]
            );

            foreach ($data['services'] as $svc) {
                $cat = \App\Models\ServiceCategory::where('slug', $svc['cat'])->first();
                if (!$cat) continue;

                \App\Models\Service::updateOrCreate(
                    ['user_id' => $user->id, 'title' => $svc['title']],
                    [
                        'category_id' => $cat->id,
                        'description' => $svc['desc'],
                        'min_price'   => $svc['price'],
                        'price_type'  => $svc['type'],
                        'images'      => [$svc['img']],
                        'is_active'   => true,
                    ]
                );
            }
        }
    }
}
