import React from "react";
import Header from "./Header";
import { useState } from "react";
import { TERMINAL_STATE_TRANSLATION_MAP, STATUS_MESSAGE_TRANSLATION_MAP } from "./Translations";

function App() {
    const [userInput, setUserInput] = useState("");
    const [trackingNumber, setTrackingNumber] = useState("");
    const [response, setResponse] = useState({});
    const [responseBody, setResponseBody] = useState({
        CurrentStatus: { state: "" },
        TransitEvents: [
            {
                "state": "",
                "timestamp": ""
            }
        ]
    });
    const terminalStateTranslation = TERMINAL_STATE_TRANSLATION_MAP;
    const statusMessageTranslation = STATUS_MESSAGE_TRANSLATION_MAP;

    function handleUserInput(event) {
        setUserInput(event.target.value);
    }

    async function handleUserQuery(event) {
        setTrackingNumber(userInput);

        /* If user cleared the input, then clear the page. */
        if (userInput.trim().length == 0) {
            setResponse({});
            setUserInput("");
            return;
        }

        /* Make the remote api call, and update the response body. */
        var response1 = await fetch(`https://tracking.bosta.co/shipments/track/` + userInput);
        var responseBody1 = await response1.json();

        setResponse(response1);

        /* As the response body is only used if the shipment exists, 
        then no need to update the response body, if the shipment doesn't exist. */
        if (response1.status != 404) {
            setResponseBody(responseBody1);
        }

        event.preventDefault();
    }

    function ShipmentHistory(props) {
        var translatedTerminalState = terminalStateTranslation.get(responseBody.CurrentStatus.state);
        var translatedStatusMessage = statusMessageTranslation.get(responseBody.CurrentStatus.state);

        return <div>
            <div className="diplay-xl"> {translatedTerminalState} </div>
            <div className="dispaly-4">
                {translatedStatusMessage}
                <div className="display-3"> {responseBody.TransitEvents[responseBody.TransitEvents.length - 1].timestamp} </div>
            </div>
            <br></br>

            <div class="divider"></div>

            <div class="position-log">
                <div class="timeline">
                    <div class="container right">
                        <div className="display-5"> ACTIVITY LOG </div>
                        <div class="user-card">
                            <p>{responseBody.TransitEvents[responseBody.TransitEvents.length - 1].timestamp}</p>
                            <div class="content">
                                <h2>{statusMessageTranslation.get(responseBody.TransitEvents[responseBody.TransitEvents.length - 1].state)}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>;
    }

    function NoShipmentFound(props) {
        return <div class="err"><div class="error">No record of this tracking userInput can be found at this time, please check the userInput and try again later. For further assistance, please contact Customer Service.</div></div>;
    }

    function QueryResult(props) {
        var status = props.status;
        
        if (status === 404) {
            return <NoShipmentFound />;
        } else if (status === 200) {
            return <ShipmentHistory />;
        } else {
            return <div></div>;
        }
    }

    return (
        <div>
            <Header />

            <div className="Tracking-label"> Track Your Shipment</div>
            <div className="  input-position"  >
                <input
                    onChange={handleUserInput}
                    type="text"
                    class="ant-input "
                    placeholder="Tracking No."
                    value={userInput}
                />

                <button type="submit" class="ant-btn" onClick={handleUserQuery}>
                    <svg padding="10px 10px " width="50" height="50" viewBox="-5 -10 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21L28 28" stroke="white" strokeWidth="3" strokeLinecap="round"></path>
                        <circle cx="13" cy="13" r="11" stroke="white" strokeWidth="3"></circle>
                    </svg>
                </button>
            </div>

            <div className="display1"> Shipment No. {trackingNumber} </div>

            <QueryResult status={response.status} />

        </div>
    );
}

export default App;