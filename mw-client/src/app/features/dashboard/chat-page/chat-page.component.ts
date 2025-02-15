import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../services/api.service';
interface Message {
  content: string;
  role: string;
}

@Component({
  selector: 'app-chat-page',
  standalone: false,
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss'],
})
export class ChatPageComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  messageInput: string = '';
  messages: Message[] = [];
  defaultModel: string = 'meta-llama/llama-3.3-70B-instruct';
  selectedModel: string = this.defaultModel;
  isLoading: boolean = false;

  // Métriques (à connecter avec un service plus tard)
  metrics = {
    requests: { current: 3, max: 5 },
    tokens: { current: 1024, max: 2048 },
  };

  constructor(private apiService: ApiService) {
    // Message initial de l'assistant
    this.messages.push({
      role: 'assistant',
      content: "Bonjour! Comment puis-je vous aider aujourd'hui?",
    });
  }

  ngOnInit(): void {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop =
        this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  sendMessage(): void {
    if (!this.messageInput.trim()) return;

    const userMessage = {
      role: 'user',
      content: this.messageInput,
    };

    this.messages.push(userMessage);
    this.isLoading = true;

    // Appel à l'API avec le bon format
    this.apiService
      .post(
        '/v1/chat/completions',
        {
          model: this.selectedModel,
          messages: [
            {
              role: 'user',
              content: this.messageInput,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${environment.userApiKey}`,
          },
        }
      )
      .subscribe({
        next: (response: any) => {
          this.messages.push({
            role: 'assistant',
            content: response.choices[0].message.content,
          });
        },
        error: (error) => {
          console.error("Erreur lors de l'envoi du message:", error);
          this.messages.push({
            role: 'assistant',
            content:
              "Désolé, une erreur est survenue lors de l'envoi du message.",
          });
        },
      })
      .add(() => {
        this.isLoading = false;
      });

    this.messageInput = '';
  }

  onModelChange() {
    this.defaultModel = this.selectedModel;
  }
}
