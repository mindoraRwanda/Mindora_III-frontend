import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";

export default withAuth(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async function middleware(request: NextRequest) {
        //console.log("middleware", request.auth);
    }, {
        isReturnToCurrentPage: true,
    }
)

export const config = {
    matcher: [
        // Only protect routes starting with /ds/
        '(ds)/dashboard'
    ]
}