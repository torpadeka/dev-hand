import React from "react";
import { Card } from "./ui/card";

const MembershipPay: React.FC = ()=> {
    

    return <>
        <div>
            <Card>
                <h1>Premium</h1>
                <button>Choose Premium Membership</button>
                <p>Ads Block</p>
                <p>Question Priority</p>
                <p>Mentoring Session with Expert</p>
                <div>
                    <p>Cancel Anytime</p>
                </div>
            </Card>
            <Card>
                <h1>Standard</h1>
                <button>Choose Standard Membership</button>
                <p>Ads Block</p>
                <p>Question Priority</p>
                <p>Mentoring Session with Expert</p>
                <div>
                    <p>Cancel Anytime</p>
                </div>
            </Card>
        </div>
    
    </>
}

export default MembershipPay;