import { useState } from "react"
import { Inertia } from '@inertiajs/inertia'
import { usePage } from "@inertiajs/react"
import { type SharedData } from "@/types";
import { Clock, FileText, BookMarked, ListTodo, Lightbulb, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from '../components/navbar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"

const learningMethods = [
  {
    id: 1,
    title: "Pomodoro Technique",
    description: "Work for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer break.",
    icon: Clock,
    benefits: [
      "Improves focus and concentration",
      "Reduces mental fatigue",
      "Increases productivity",
      "Creates a sense of urgency",
    ],
  },
  {
    id: 2,
    title: "Spaced Repetition",
    description: "Review information at increasing intervals to improve long-term retention.",
    icon: ListTodo,
    benefits: [
      "Enhances long-term memory",
      "Reduces forgetting curve",
      "More efficient than cramming",
      "Ideal for memorization tasks",
    ],
  },
  {
    id: 3,
    title: "Feynman Technique",
    description: "Explain a concept in simple terms to identify gaps in your understanding.",
    icon: BookMarked,
    benefits: [
      "Identifies knowledge gaps",
      "Deepens understanding",
      "Simplifies complex concepts",
      "Improves teaching ability",
    ],
  },
  {
    id: 4,
    title: "Active Recall",
    description: "Test yourself on material instead of passively reviewing it.",
    icon: Lightbulb,
    benefits: [
      "Strengthens neural connections",
      "Improves retrieval practice",
      "Identifies weak areas",
      "More effective than re-reading",
    ],
  },
  {
    id: 5,
    title: "Mind Mapping",
    description: "Create visual diagrams to connect related concepts and ideas.",
    icon: LayoutGrid,
    benefits: [
      "Visualizes connections between ideas",
      "Enhances creative thinking",
      "Improves organization of thoughts",
      "Makes review more engaging",
    ],
  },
  {
    id: 6,
    title: "Cornell Method",
    description: "Divide your page into sections for notes, cues, and summary.",
    icon: FileText,
    benefits: [
      "Organizes notes effectively",
      "Creates built-in study questions",
      "Facilitates active review",
      "Summarizes key concepts",
    ],
  },
]

export default function DashboardPage() {
  const { auth } = usePage<SharedData>().props;
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null)
  const handleSelectMethod = (methodId: number) => {
    Inertia.visit(`/notepad?method=${methodId}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#E0F2F1] text-[#263238] dark:bg-[#263238] dark:text-[#E0F2F1]">
      <Navbar />
      <div className="flex flex-col items-center justify-center pt-8 bg-[#E0F2F1] text-[#263238] dark:bg-[#263238] dark:text-[#E0F2F1]">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 text-[#00796B] dark:text-[#4DB6AC]">Welcome to Learn2Learn, {auth.user.name}</h1>
          <p className="text-[#263238]/80 dark:text-[#E0F2F1]/80">Select a learning method below to get started with your notes.</p>
        </div>

        <div className="flex items-center justify-center flex p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-full">
            {learningMethods.map((method) => (
              <Card
                key={method.id}
                className="overflow-hidden hover:shadow-md transition-shadow border-[#4DB6AC] bg-[#B2DFDB] dark:bg-[#263238] dark:border-[#4DB6AC]"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full p-2 bg-[#00796B] text-[#E0F2F1] dark:bg-[#4DB6AC] dark:text-[#263238]">
                      <method.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-lg text-[#00796B] dark:text-[#4DB6AC]">{method.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <CardDescription className="line-clamp-2 text-[#263238]/80 dark:text-[#E0F2F1]/80">{method.description}</CardDescription>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-[#00796B] text-[#00796B] hover:bg-[#4DB6AC] hover:text-[#E0F2F1] dark:border-[#4DB6AC] dark:text-[#4DB6AC] dark:hover:bg-[#B2DFDB] dark:hover:text-[#263238]"
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    Learn More
                  </Button>
                  <Button
                    className="flex-1 bg-[#00796B] text-[#E0F2F1] hover:bg-[#4DB6AC] dark:bg-[#4DB6AC] dark:text-[#263238] dark:hover:bg-[#B2DFDB]"
                    onClick={() => handleSelectMethod(method.id)}
                  >
                    Use Method
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={selectedMethod !== null} onOpenChange={(open) => !open && setSelectedMethod(null)}>
        <DialogContent className="sm:max-w-md bg-[#B2DFDB] dark:bg-[#263238]">
          {selectedMethod !== null && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-full p-2 bg-[#00796B] text-[#E0F2F1] dark:bg-[#4DB6AC] dark:text-[#263238]">
                    {(() => {
                      const IconComponent = learningMethods[selectedMethod - 1].icon
                      return <IconComponent className="h-8 w-8" />
                    })()}
                  </div>
                  <DialogTitle className="text-[#00796B] dark:text-[#4DB6AC]">{learningMethods[selectedMethod - 1].title}</DialogTitle>
                </div>
                <DialogDescription className="pt-2 text-[#263238]/80 dark:text-[#E0F2F1]/80">
                  {learningMethods[selectedMethod - 1].description}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-[#00796B] dark:text-[#4DB6AC]">Benefits:</h4>
                <ul className="text-sm text-[#263238]/80 dark:text-[#E0F2F1]/80 space-y-2">
                  {learningMethods[selectedMethod - 1].benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-[#00796B] dark:text-[#4DB6AC]">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <DialogClose asChild>
                  <Button variant="outline" className="border-[#00796B] text-[#00796B] hover:bg-[#4DB6AC] hover:text-[#E0F2F1] dark:border-[#4DB6AC] dark:text-[#4DB6AC] dark:hover:bg-[#B2DFDB] dark:hover:text-[#263238]">
                    Close
                  </Button>
                </DialogClose>
                <Button
                  className="bg-[#00796B] text-[#E0F2F1] hover:bg-[#4DB6AC] dark:bg-[#4DB6AC] dark:text-[#263238] dark:hover:bg-[#B2DFDB]"
                  onClick={() => handleSelectMethod(selectedMethod)}
                >
                  Use This Method
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}