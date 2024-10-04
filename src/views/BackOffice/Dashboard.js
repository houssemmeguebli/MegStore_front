import React, { useEffect, useRef } from "react";
import PowerBIService from "../../_services/PowerBIService";

export default function Dashboard() {
    const embedUrl = "https://app.powerbi.com/reportEmbed?reportId=f4b025bd-407e-4ddf-bc9f-ff5a5bd11c96&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLU5PUlRILUVVUk9QRS1JLVBSSU1BUlktcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7InVzYWdlTWV0cmljc1ZOZXh0Ijp0cnVlfX0%3d";
    const accessToken = "YOUR_ACCESS_TOKEN_HERE"; // Replace with your actual token

    const reportRef = useRef();

    useEffect(() => {
        if (embedUrl && accessToken && reportRef.current) {
            try {
                PowerBIService.embedReport(reportRef.current, embedUrl, accessToken);
            } catch (error) {
                console.error("Error during report embedding:", error);
            }
        } else {
            if (!reportRef.current) {
                console.error("Reference to Power BI container is not available");
            }
            if (!embedUrl || !accessToken) {
                console.error("Embed URL or Access Token is missing");
            }
        }

        return () => {
            if (reportRef.current) {
                try {
                    PowerBIService.resetReport(reportRef.current);
                } catch (error) {
                    console.error("Error during report reset:", error);
                }
            }
        };
    }, [embedUrl, accessToken]);

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full  shadow-lg  bg-white" style={{ marginBottom:"5%",width:"100%", height:"100%"}}>
            <div className="mt-5 bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-4" style={{height: "600px"}}>
                    <div ref={reportRef} className="w-full h-full"></div>
                </div>
            </div>
        </div>

    );
}
