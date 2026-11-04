import Footer from "@/components/Footer"
import  Header  from "@/components/Header"



export default function RSLayout ({
    children,
} : {
    children: React.ReactNode
}) {
    return (
     <div className="mx-auto w-full max-w-7xl">
        <Header />
       <main className="flex-grow">{children}</main>
        <Footer/>
     </div>
    )
}

